const BASE = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function calculateLexoRank(prevRank: string | null, nextRank: string | null, currentBucket = 0): string {
  const base = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const midChar = (left: string, right: string) => {
    const leftIndex = base.indexOf(left);
    const rightIndex = base.indexOf(right);

    if (leftIndex + 1 < rightIndex) {
      return base[Math.floor((leftIndex + rightIndex) / 2)];
    }
    return left; // 고갈 방지
  };

  const prevBucket = prevRank?.split('|')[0] || `${currentBucket}`;
  const nextBucket = nextRank?.split('|')[0] || `${currentBucket}`;
  const left = prevRank?.split('|')[1] || 'AAAA';
  const right = nextRank?.split('|')[1] || 'ZZZZ';

  let result = '';
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const leftChar = left[i] || '0';
    const rightChar = right[i] || 'Z';

    result += midChar(leftChar, rightChar);
    if (result[result.length - 1] !== leftChar && result[result.length - 1] !== rightChar) {
      break;
    }
  }

  if (prevBucket === nextBucket) {
    return `${prevBucket}|${result}`;
  }

  // Bucket 전환 필요
  const newBucket = (parseInt(prevBucket, 10) + 1) % 3; // 순환 Bucket (0 → 1 → 2 → 0)
  return `${newBucket}|${result}`;
}

