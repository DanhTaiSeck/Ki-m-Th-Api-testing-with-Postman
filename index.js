const axios = require('axios');

const API_BASE_URL = 'https://api.dak.edu.vn/api_rau/vegetables.php';

function displayError(error) {
    console.error('Lỗi:', error.response?.data?.message || error.message);
}

async function getVegetables(page = 1, limit = 5) {
    try {
        const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
        
        console.log(`Danh sách rau củ - Trang ${page}/${response.data.pages}:`);
        console.log('--------------------------------');
        response.data.data.forEach(veg => {
            console.log(`ID: ${veg.id}`);
            console.log(`Tên: ${veg.name}`);
            console.log(`Giá: ${veg.price} VND`);
            console.log(`Nhóm: ${veg.group}`);
            console.log('--------------------------------');
        });
        
        console.log(`Tổng số: ${response.data.total} mục`);
        return response.data.data; // Trả về danh sách rau củ
    } catch (error) {
        displayError(error);
        return [];
    }
}

async function addVegetable(vegetableData) {
    if (!vegetableData.name || !vegetableData.price) {
        console.error('Lỗi: Tên và giá là bắt buộc');
        return null;
    }

    try {
        const response = await axios.post(API_BASE_URL, vegetableData);
        
        console.log('Thêm rau củ thành công:');
        console.log('--------------------------------');
        console.log(`ID: ${response.data.data.id}`);
        console.log(`Tên: ${response.data.data.name}`);
        console.log(`Giá: ${response.data.data.price} VND`);
        console.log('--------------------------------');
        console.log(response.data.message);
        
        return response.data;
    } catch (error) {
        displayError(error);
        return null;
    }
}

async function updateVegetable(id, updateData) {
    if (!id || isNaN(id)) {
        console.error('Lỗi: ID không hợp lệ');
        return false;
    }

    if (!updateData.price && !updateData.description) {
        console.error('Lỗi: Cần cung cấp ít nhất một trường để cập nhật');
        return false;
    }

    try {
        const response = await axios.put(`${API_BASE_URL}?id=${id}`, updateData);
        
        console.log('Cập nhật thành công:');
        console.log('--------------------------------');
        console.log(`ID: ${id}`);
        console.log(response.data.message);
        console.log('Các trường đã cập nhật:', response.data.updated_fields?.join(', ') || 'N/A');
        return true;
    } catch (error) {
        displayError(error);
        return false;
    }
}

async function deleteVegetable(id) {
    if (!id || isNaN(id)) {
        console.error('Lỗi: ID không hợp lệ');
        return false;
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
        console.log(response.data.message);
        return true;
    } catch (error) {
        displayError(error);
        return false;
    }
}

async function main() {
    console.log('=== ỨNG DỤNG QUẢN LÝ RAU CỦ ===\n');
    
    // 1. Lấy danh sách rau củ
    const vegetables = await getVegetables(1);
    if (vegetables.length === 0) {
        console.log('Không có dữ liệu rau củ để thao tác');
        return;
    }
    
    // 2. Thêm rau củ mới
    const newVegetable = {
        name: "Rau muống",
        price: 15000,
        group: "Lá",
        description: "Rau muống tươi ngon"
    };
    const addedResult = await addVegetable(newVegetable);
    
    if (addedResult && addedResult.data && addedResult.data.id) {
        const newId = addedResult.data.id;
        
        // 3. Cập nhật rau củ vừa thêm
        console.log('\nĐang cập nhật rau củ mới thêm...');
        await updateVegetable(newId, {
            price: 18000,
            description: "Rau muống tươi ngon, giàu dinh dưỡng"
        });
        
        // 4. Xóa rau củ vừa thêm
        console.log('\nĐang xóa rau củ mới thêm...');
        await deleteVegetable(newId);
    } else {
        console.log('Không thể thêm rau củ mới để thực hiện các thao tác tiếp theo');
    }
}

main().catch(console.error);