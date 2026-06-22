import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('=== Starting Automated API Verification ===');
  
  try {
    // 1. Test Auth: Login customer
    console.log('\n1. Testing Customer Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'customer@atsveshti.com',
      password: 'user123'
    });
    const token = loginRes.data.token;
    const customerId = loginRes.data._id;
    console.log('✔ Success! Token acquired for customer:', loginRes.data.name);

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Fetch Products and search
    console.log('\n2. Testing Products retrieval...');
    const prodRes = await axios.get(`${API_URL}/products`);
    console.log(`✔ Success! Retrieved ${prodRes.data.length} products.`);

    console.log('\nTesting Product Search ("silk")...');
    const searchRes = await axios.get(`${API_URL}/products?search=silk`);
    console.log(`✔ Success! Retrieved ${searchRes.data.length} matches for "silk".`);

    const testProduct = prodRes.data[0];
    console.log(`Using product for further tests: "${testProduct.name}" (ID: ${testProduct._id})`);

    // 3. Test Wishlist
    console.log('\n3. Testing Wishlist Operations...');
    const wishlistAdd = await axios.post(`${API_URL}/wishlist`, { productId: testProduct._id }, config);
    console.log('✔ Success! Added to wishlist. Total count:', wishlistAdd.data.length);

    const wishlistRemove = await axios.delete(`${API_URL}/wishlist/${testProduct._id}`, config);
    console.log('✔ Success! Removed from wishlist. Total count:', wishlistRemove.data.length);

    // 4. Test Cart Management
    console.log('\n4. Testing Cart Sync...');
    const cartAdd = await axios.post(`${API_URL}/cart`, {
      productId: testProduct._id,
      quantity: 2,
      size: '4 Meters (Double Veshti)'
    }, config);
    console.log('✔ Success! Cart sync items count:', cartAdd.data.length);

    // 5. Test Coupon Verification
    console.log('\n5. Testing Coupon Validation (WELCOME10)...');
    const couponRes = await axios.post(`${API_URL}/coupons/validate`, {
      code: 'WELCOME10',
      cartTotal: testProduct.price * 2
    }, config);
    console.log(`✔ Success! Validated coupon. Calculated discount: ₹${couponRes.data.calculatedDiscount}`);

    // 6. Test Payments Order creation (Razorpay Simulation)
    console.log('\n6. Testing Payment simulator...');
    const payRes = await axios.post(`${API_URL}/payments/create-order`, { amount: 3000 }, config);
    console.log(`✔ Success! Created payment reference. Simulated ID: ${payRes.data.id} (IsMock: ${payRes.data.isMock})`);

    // 7. Test Order Placement
    console.log('\n7. Testing Order Placement (COD)...');
    const orderRes = await axios.post(`${API_URL}/orders`, {
      orderItems: [
        {
          product: testProduct._id,
          name: testProduct.name,
          quantity: 2,
          price: testProduct.discountPrice || testProduct.price,
          image: testProduct.images[0],
          size: '4 Meters (Double Veshti)'
        }
      ],
      shippingAddress: {
        street: '45 Palace Road, Adyar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600020',
        country: 'India'
      },
      paymentMethod: 'COD',
      totalPrice: testProduct.price * 2,
      discountPrice: couponRes.data.calculatedDiscount,
      finalPrice: Math.round((testProduct.price * 2 - couponRes.data.calculatedDiscount) * 1.18 + 100), // subtotal with tax and shipping
    }, config);
    const createdOrderId = orderRes.data._id;
    console.log(`✔ Success! Placed order. ID: ${createdOrderId}`);

    // 8. Test Review Submission
    console.log('\n8. Testing Review Submissions...');
    const reviewRes = await axios.post(`${API_URL}/reviews/${testProduct._id}`, {
      rating: 5,
      comment: 'Automated test review - Excellent handloom craftsmanship!'
    }, config);
    console.log('✔ Success! Submitting review:', reviewRes.data.message);

    // 9. Test Cancel Order
    console.log('\n9. Testing Order Cancellation...');
    const cancelRes = await axios.put(`${API_URL}/orders/${createdOrderId}/cancel`, {}, config);
    console.log('✔ Success! Order cancelled. Updated status:', cancelRes.data.orderStatus);

    console.log('\n=== All API Tests Passed Successfully! ===');
  } catch (error) {
    console.error('✖ Verification Error:', error.response?.data || error.message);
  }
};

runTests();
