const axios = require('axios');
const fs = require('fs');

const results = []; // 각 테스트 결과를 저장

async function seedData() {
  console.log('Seeding data...');
  const response = await axios.post('http://localhost:8080/courses/seed');
  console.log('Seed data response:', response.data);
}

async function recordResult(name, start) {
  const duration = Date.now() - start;
  results.push({ name, duration });
  console.log(`${name} 처리 시간: ${duration} ms`);
}

// PUT 방식 - 싱글 업데이트
async function testSingleUpdatePUT(dataSize, moveCount) {
  await seedData();
  const updatedPlaces = generateUpdatedOrder(dataSize, moveCount).map((place, index) => ({
    placeId: place.id,
    orderIndex: index + 1,
  }));

  const start = Date.now();
  const response = await axios.put('http://localhost:8080/courses/2/places/single', {
    places: updatedPlaces,
  });
  console.log(`싱글 업데이트 PUT (${dataSize}개, ${moveCount}칸 이동) 완료:`, response.data);
  await recordResult(`싱글 업데이트 PUT (${dataSize}개, ${moveCount}칸 이동)`, start);
}

// PUT 방식 - 벌크 업데이트
async function testBulkUpdatePUT(dataSize, moveCount) {
  await seedData();
  const updatedPlaces = generateUpdatedOrder(dataSize, moveCount).map((place, index) => ({
    placeId: place.id,
    orderIndex: index + 1,
  }));

  const start = Date.now();
  const response = await axios.put('http://localhost:8080/courses/2/places/bulk', {
    places: updatedPlaces,
  });
  console.log(`벌크 업데이트 PUT (${dataSize}개, ${moveCount}칸 이동) 완료:`, response.data);
  await recordResult(`벌크 업데이트 PUT (${dataSize}개, ${moveCount}칸 이동)`, start);
}

// Reorank 방식
async function testLexorank(dataSize, moveCount) {
  await seedData();
  const updatedPlaces = generateUpdatedOrder(dataSize, moveCount).map((place, index) => ({
    placeId: place.id,
    rank: `${index + 1}.5`,
  }));

  const start = Date.now();
  const response = await axios.post('http://localhost:8080/courses/2/places/lexorank', {
    updatedPlaces,
  });
  console.log(`Reorank (${dataSize}개, ${moveCount}칸 이동) 완료:`, response.data);
  await recordResult(`Reorank (${dataSize}개, ${moveCount}칸 이동)`, start);
}

// 링크드 리스트 방식
async function testLinkedList(dataSize, moveCount) {
  const updatedPlaces = generateUpdatedOrder(dataSize, moveCount).map((place, index, array) => ({
    id: place.id,
    prevId: index === 0 ? null : array[index - 1].id,
  }));

  const start = Date.now();
  const response = await axios.post('http://localhost:8080/courses/2/places/linked-list', {
    updatedPlaces,
  });
  console.log(`링크드 리스트 (${dataSize}개, ${moveCount}칸 이동) 완료:`, response.data);
  await recordResult(`링크드 리스트 (${dataSize}개, ${moveCount}칸 이동)`, start);
}

// 개선된 링크드 리스트 방식
async function testEnhancedLinkedListReorder(dataSize, moveCount) {
  const updatedOrder = generateUpdatedOrder(dataSize, moveCount);

  const start = Date.now();
  const response = await axios.post(
    `http://localhost:8080/courses/2/places/enhanced-linked-list`,
    { updatedOrder },
  );
  console.log(`개선된 링크드 리스트 방식 (${dataSize}개, ${moveCount}칸 이동) 완료:`, response.data);
  await recordResult(`개선된 링크드 리스트 방식 (${dataSize}개, ${moveCount}칸 이동)`, start);
}

// Generate updated order
function generateUpdatedOrder(size, moveCount) {
  const originalOrder = Array.from({ length: size }, (_, i) => ({ id: i + 1 }));

  if (moveCount <= 0 || moveCount >= size) return originalOrder;

  const movedItem = originalOrder[0];
  const remainingItems = originalOrder.slice(1);

  return [
    ...remainingItems.slice(0, moveCount),
    movedItem,
    ...remainingItems.slice(moveCount),
  ];
}

// Save results to file
function saveResultsToFile() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = `test-results-${timestamp}.json`;

  fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n=== 테스트 결과가 파일로 저장되었습니다: ${filePath} ===`);
}


(async () => {
  const dataSizes = [5, 10, 50, 100, 1000];
  const moveCounts = [1, 2, 5, 10];

  // for (const size of dataSizes) {
  //   for (const move of moveCounts) {
  //     console.log(`\n=== 데이터 크기: ${size}, 이동 칸수: ${move} ===`);
  //
  //     console.log('싱글 업데이트 PUT 테스트 시작');
  //     await testSingleUpdatePUT(size, move);
  //   }
  // }

  for (const size of dataSizes) {
    for (const move of moveCounts) {
      console.log(`\n=== 데이터 크기: ${size}, 이동 칸수: ${move} ===`);
      console.log('벌크 업데이트 PUT 테스트 시작');
      await testBulkUpdatePUT(size, move);
    }
  }

  // for (const size of dataSizes) {
  //   for (const move of moveCounts) {
  //     console.log(`\n=== 데이터 크기: ${size}, 이동 칸수: ${move} ===`);
  //     console.log('Reorank 테스트 시작');
  //     await testLexorank(size, move);
  //   }
  // }

  // console.log('\n=== 링크드 리스트 별도 테스트 ===');
  // for (const size of dataSizes) {
  //   for (const move of moveCounts) {
  //     console.log(`링크드 리스트 (${size}개, ${move}칸 이동)`);
  //     await testLinkedList(size, move);
  //
  //     console.log(`개선된 링크드 리스트 (${size}개, ${move}칸 이동)`);
  //     await testEnhancedLinkedListReorder(size, move);
  //   }
  // }

  // 결과 출력 및 저장
  console.log('\n=== 테스트 결과 ===');
  results.forEach((result) => {
    console.log(`${result.name}: ${result.duration} ms`);
  });
  saveResultsToFile();
})();
