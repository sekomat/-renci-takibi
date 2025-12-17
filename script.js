const form = document.getElementById('student-form');
const result = document.getElementById('result');

const numberFields = ['pages-read', 'total-pages', 'correct-answers', 'wrong-answers'];

function formatDate(input) {
  const date = new Date(input);
  return isNaN(date) ? '-' : date.toLocaleDateString('tr-TR');
}

function createCard(title, content) {
  const card = document.createElement('div');
  card.className = 'card';
  const heading = document.createElement('h3');
  heading.textContent = title;
  const body = document.createElement('div');
  body.innerHTML = content;
  card.appendChild(heading);
  card.appendChild(body);
  return card;
}

function validateForm(formData) {
  const errors = [];
  const start = new Date(formData.get('start-date'));
  const end = new Date(formData.get('end-date'));
  if (start > end) {
    errors.push('Başlangıç tarihi, bitiş tarihinden sonra olamaz.');
  }

  const pagesRead = Number(formData.get('pages-read'));
  const totalPages = Number(formData.get('total-pages'));
  if (pagesRead > totalPages) {
    errors.push('Okunan sayfa sayısı toplam sayfadan fazla olamaz.');
  }

  return errors;
}

function buildProgress(pagesRead, totalPages) {
  const percent = totalPages > 0 ? Math.min((pagesRead / totalPages) * 100, 100) : 0;
  return `
    <div><strong>Okuma İlerlemesi:</strong> %${percent.toFixed(1)}</div>
    <div class="progress">
      <div class="progress-bar" style="width:${percent}%"></div>
    </div>
  `;
}

function buildExamSummary(correct, wrong) {
  const net = correct - wrong * 0.25;
  return `<div><span class="badge">Deneme Sonucu</span> Doğru: ${correct}, Yanlış: ${wrong}, Net: ${net.toFixed(2)}</div>`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  numberFields.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = input.value.trim();
    }
  });

  const errors = validateForm(formData);
  result.innerHTML = '';

  if (errors.length) {
    const ul = document.createElement('ul');
    ul.className = 'card error';
    errors.forEach((err) => {
      const li = document.createElement('li');
      li.textContent = err;
      ul.appendChild(li);
    });
    result.appendChild(ul);
    return;
  }

  const studentInfo = createCard('Öğrenci', `
    <div><strong>Ad:</strong> ${formData.get('student-name')}</div>
    <div><strong>Numara:</strong> ${formData.get('student-id')}</div>
  `);

  const bookInfo = createCard('Kitap', `
    <div><strong>Kitap:</strong> ${formData.get('book-title')} (${formData.get('book-author')})</div>
    <div><strong>Tarih:</strong> ${formatDate(formData.get('start-date'))} - ${formatDate(formData.get('end-date'))}</div>
    <div>${buildProgress(Number(formData.get('pages-read')), Number(formData.get('total-pages')))}</div>
  `);

  const subjectInfo = createCard('Ders', `
    <div><strong>Ders:</strong> ${formData.get('subject')}</div>
    <div><strong>Kaynak:</strong> ${formData.get('study-source')}</div>
  `);

  const examInfo = createCard('Deneme', buildExamSummary(
    Number(formData.get('correct-answers')),
    Number(formData.get('wrong-answers')),
  ));

  result.appendChild(studentInfo);
  result.appendChild(bookInfo);
  result.appendChild(subjectInfo);
  result.appendChild(examInfo);
});
