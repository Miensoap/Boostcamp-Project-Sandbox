import * as vscode from "vscode";
import axios from "axios";

const 초 = 1000;
const 분 = 60 * 초;
const 시간 = 60 * 분;

let startTime: number | null = null;
let totalActiveTime = 0;
let currentLanguage: string | null = null;
const SERVER_URL = "http://localhost:8080/activity";

// 확장 실행시
export function activate(context: vscode.ExtensionContext) {
  console.log("extension activated");

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) startTracking(editor);
  });

  // 언어 확인
  vscode.window.onDidChangeTextEditorSelection((event) => {
    const editor = event.textEditor;
    if (editor && editor.document.languageId !== currentLanguage) {
      currentLanguage = editor.document.languageId;
    }
  });

  const interval = setInterval(() => {
    if (totalActiveTime > 0) {
      sendDataToServer(totalActiveTime, currentLanguage);
      totalActiveTime = 0;
    }
  }, 5 * 초);

  context.subscriptions.push({
    dispose: () => clearInterval(interval),
  });
}

function startTracking(editor: vscode.TextEditor) {
  console.log("start tracking");

  // stopTracking을 먼저 호출하여 현재 추적 상태를 종료
  stopTracking();

  // 새로운 추적 시작
  startTime = Date.now();
  currentLanguage = editor.document.languageId;
}

function stopTracking() {
  if (startTime !== null) {
    totalActiveTime += Date.now() - startTime;
    startTime = null;
  }

  console.log("stop tracking", totalActiveTime);
}

async function sendDataToServer(activeTime: number, language: string | null) {
  const data = {
    activeTime: activeTime / 초,
    language,
    timestamp: new Date().toISOString(),
  };

  try {
    await axios.post(SERVER_URL, data);
    console.log("서버로 데이터 전송 성공 : ", data);
  } catch (error) {
    console.error("서버로 데이터 전송 실패:", error);
  }
  stopTracking();
}

// 확장 종료시
export function deactivate() {
  stopTracking();
}
