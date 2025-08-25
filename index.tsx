/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

// Note: This is a placeholder for the API key, which is expected to be
// securely managed and injected by the execution environment.
const GEMINI_API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const form = document.getElementById('simplifier-form') as HTMLFormElement;
const paragraphInput = document.getElementById(
  'paragraph-input'
) as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const resultContainer = document.getElementById(
  'result-container'
) as HTMLElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const originalText = paragraphInput.value.trim();
  setLoading(true);

  try {
    const simplifiedText = await simplifyParagraph(originalText);
    displayResult(simplifiedText);
  } catch (error) {
    console.error(error);
    displayError('Ôi! Đã xảy ra lỗi trong quá trình đơn giản hóa văn bản.');
  } finally {
    setLoading(false);
  }
});

async function simplifyParagraph(text: string): Promise<string> {
  const prompt = `Hãy đơn giản hóa đoạn văn sau cho mọi người đều hiểu. Chia nhỏ các câu phức tạp, thay thế các thuật ngữ chuyên ngành bằng những từ đơn giản hơn và đảm bảo giữ nguyên ý nghĩa ban đầu. Không thêm bất kỳ cụm từ giới thiệu hoặc kết luận nào như "Đây là văn bản đã được đơn giản hóa". Chỉ cần cung cấp trực tiếp văn bản đã được đơn giản hóa.\n\n---\n\n${text}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text.trim();
}

function setLoading(isLoading: boolean) {
  generateBtn.disabled = isLoading;
  const btnText = generateBtn.querySelector('.btn-text') as HTMLSpanElement;

  if (isLoading) {
    resultContainer.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Đang đơn giản hóa văn bản của bạn...</p>
      </div>
    `;
    btnText.textContent = 'Đang xử lý...';
  } else {
    btnText.textContent = 'Đơn Giản Hóa';
  }
}

function displayResult(simplifiedText: string) {
  resultContainer.innerHTML = `
    <div class="result-card">
      <div class="result-text">
        <h2>Phiên bản đơn giản hóa</h2>
        <p>${simplifiedText}</p>
      </div>
    </div>
  `;
}

function displayError(message: string) {
  resultContainer.innerHTML = `
    <div class="error-state">
      <p><strong>Lỗi:</strong> ${message}</p>
      <p>Vui lòng kiểm tra console để biết thêm chi tiết và thử lại.</p>
    </div>
  `;
}