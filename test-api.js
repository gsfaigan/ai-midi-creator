import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('Testing API key:', API_KEY ? 'Found' : 'Not found');

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: 'Say hello'
      }]
    }]
  })
})
.then(res => res.json())
.then(data => {
  console.log('API Response:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('Error:', err.message);
});
