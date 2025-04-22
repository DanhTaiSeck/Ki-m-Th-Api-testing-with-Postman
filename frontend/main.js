const API_BASE = 'https://api.dak.edu.vn/api_rau/vegetables.php';
let allVegetables = []; // Dùng để lưu toàn bộ rau củ đã fetch về
let currentPage = 1;
let totalPages = 1;
const ITEMS_PER_PAGE = 5;

// Lấy danh sách rau củ theo trang
async function fetchVegetables(page = 1) {
  const res = await fetch(`${API_BASE}?page=${page}&limit=${ITEMS_PER_PAGE}`);
  const data = await res.json();
  allVegetables = data.data;
  totalPages = data.pages;
  currentPage = data.page;
  renderVegetables(allVegetables);
  renderPagination();
}

// Hiển thị rau củ
function renderVegetables(vegs) {
  const list = document.getElementById('vegetable-list');
  list.innerHTML = '';

  if (vegs.length === 0) {
    list.innerHTML = `<div class="no-result">🦬 Không tìm thấy rau nào khớp!</div>`;
    return;
  }

  vegs.forEach((veg, i) => {
    const div = document.createElement('div');
    div.className = 'veg-card animate-in';
    div.style.animationDelay = `${i * 0.05}s`;
    div.innerHTML = `
      <strong>${veg.name}</strong> - <em>${veg.price} VND</em><br>
      <small><b>Nhóm:</b> ${veg.group || 'Không rõ'}</small><br>
      <small><b>Mô tả:</b> ${veg.description || 'Không có'}</small><br>
      <button class="edit" onclick="editVegetable(${veg.id})">✏️ Sửa</button>
      <button class="delete" onclick="deleteVegetable(${veg.id})">🗑️ Xóa</button>
    `;
    list.appendChild(div);
  });
}

// Hiển thị phân trang
function renderPagination() {
  const container = document.getElementById('pagination');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = () => fetchVegetables(i);
    container.appendChild(btn);
  }
}

// Xử lý form thêm rau củ
document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const price = parseInt(document.getElementById('price').value);
  const group = document.getElementById('group').value.trim();
  const description = document.getElementById('description').value.trim();

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, group, description })
  });
  const result = await res.json();
  alert(result.message);
  e.target.reset();
  fetchVegetables(currentPage);
});

// Xoá rau củ
async function deleteVegetable(id) {
  if (!confirm("Bạn chắc chắn muốn xóa?")) return;
  const res = await fetch(`${API_BASE}?id=${id}`, { method: 'DELETE' });
  const result = await res.json();
  alert(result.message);
  fetchVegetables(currentPage);
}

// Sửa rau củ
function editVegetable(id) {
  const newPrice = prompt("Giá mới:");
  const newDesc = prompt("Mô tả mới:");
  if (!newPrice && !newDesc) return;

  fetch(`${API_BASE}?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price: newPrice ? parseInt(newPrice) : undefined,
      description: newDesc || undefined
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      fetchVegetables(currentPage);
    });
}

// Tìm kiếm rau củ
document.getElementById("search-input").addEventListener("input", async function () {
  const keyword = this.value.toLowerCase();
  if (keyword === '') return fetchVegetables(currentPage);

  const res = await fetch(`${API_BASE}?page=1&limit=1000`);
  const data = await res.json();
  const filtered = data.data.filter(veg =>
    veg.name.toLowerCase().includes(keyword)
  );
  renderVegetables(filtered);
});

// Gọi lúc đầu
fetchVegetables();
