
# Loyalty Program API Documentation

This document outlines all the API endpoints required for the frontend to connect with your Laravel backend.

## Base Configuration

- **Base URL**: `http://localhost:8000/api` (adjust for your Laravel setup)
- **Authentication**: Bearer Token authentication
- **Content-Type**: `application/json`
- **Accept**: `application/json`

## Authentication Headers

```javascript
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

---

## 1. Store Details API

### Get Store Details
- **Endpoint**: `GET /api/store`
- **Description**: Retrieve store information
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "name": "Sample Store",
    "phone": "055-123-4567",
    "address": "123 Main Street, City"
  }
}
```

### Update Store Details
- **Endpoint**: `PUT /api/store`
- **Description**: Update store information
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "name": "My Store Name",
  "phone": "055-123-4567",
  "address": "Complete store address"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Store details updated successfully",
  "data": {
    "name": "My Store Name",
    "phone": "055-123-4567",
    "address": "Complete store address"
  }
}
```

---

## 2. Admin Authentication API

### Admin Login
- **Endpoint**: `POST /api/admin/login`
- **Description**: Authenticate admin user

**Request Format:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "lastLogin": "2025-01-15T10:30:00Z"
    }
  }
}
```

### Update Admin Credentials
- **Endpoint**: `PUT /api/admin/credentials`
- **Description**: Update admin username and/or password
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "newUsername": "newadmin", // optional
  "currentPassword": "currentpass",
  "newPassword": "newpass123", // optional
  "confirmPassword": "newpass123" // required if newPassword provided
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Credentials updated successfully"
}
```

---

## 3. Admin Users Management API

### Get All Admin Users
- **Endpoint**: `GET /api/admin/users`
- **Description**: Get list of all admin users
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "lastLogin": "2025-01-15T10:30:00Z",
      "status": "active"
    },
    {
      "id": 2,
      "username": "manager",
      "lastLogin": "2025-01-14T15:20:00Z",
      "status": "active"
    }
  ]
}
```

### Create Admin User
- **Endpoint**: `POST /api/admin/users`
- **Description**: Create new admin user
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "username": "newadmin",
  "password": "password123"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "data": {
    "id": 3,
    "username": "newadmin",
    "status": "active"
  }
}
```

### Delete Admin User
- **Endpoint**: `DELETE /api/admin/users/{id}`
- **Description**: Delete admin user
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "message": "Admin user deleted successfully"
}
```

---

## 4. Customers API

### Get All Customers
- **Endpoint**: `GET /api/customers`
- **Description**: Get paginated list of customers
- **Authentication**: Required (Admin)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)
- `search` (optional): Search term for name/phone

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ahmed Mohammed",
      "phone": "0551234567",
      "email": "ahmed@example.com",
      "gender": "Male",
      "points": 2500,
      "tier": "Silver",
      "cashValue": "$125.00",
      "joined": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50,
    "per_page": 10
  }
}
```

### Get Customer by ID
- **Endpoint**: `GET /api/customers/{id}`
- **Description**: Get specific customer details
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ahmed Mohammed",
    "phone": "0551234567",
    "email": "ahmed@example.com",
    "gender": "Male",
    "points": 2500,
    "tier": "Silver",
    "cashValue": "$125.00",
    "joined": "2025-01-15T10:30:00Z",
    "transactions": [
      {
        "id": 1,
        "type": "earned",
        "points": 250,
        "amount": "$500",
        "date": "2025-01-15T10:30:00Z",
        "description": "Purchase reward"
      }
    ]
  }
}
```

### Create Customer
- **Endpoint**: `POST /api/customers`
- **Description**: Register new customer
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "fullName": "Ahmed Mohammed",
  "phoneNumber": "0551234567",
  "email": "ahmed@example.com",
  "gender": "Male",
  "pinCode": "1234"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "id": 1,
    "name": "Ahmed Mohammed",
    "phone": "0551234567",
    "email": "ahmed@example.com",
    "tier": "Bronze",
    "points": 0
  }
}
```

### Update Customer
- **Endpoint**: `PUT /api/customers/{id}`
- **Description**: Update customer information
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "name": "Ahmed Mohammed Updated",
  "phone": "0551234567",
  "email": "ahmed.updated@example.com",
  "gender": "Male"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "id": 1,
    "name": "Ahmed Mohammed Updated",
    "phone": "0551234567",
    "email": "ahmed.updated@example.com",
    "points": 2500,
    "tier": "Silver"
  }
}
```

### Delete Customer
- **Endpoint**: `DELETE /api/customers/{id}`
- **Description**: Delete customer
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

### Search Customers
- **Endpoint**: `GET /api/customers/search`
- **Description**: Search customers by name or phone
- **Authentication**: Required (Admin)

**Query Parameters:**
- `q`: Search query (required)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ahmed Mohammed",
      "phone": "0551234567",
      "points": 2500,
      "tier": "Silver"
    }
  ]
}
```

---

## 5. Points Management API

### Earn Points
- **Endpoint**: `POST /api/points/earn`
- **Description**: Add points to customer account
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "customerId": 1,
  "points": 250,
  "amount": 500.00,
  "description": "Purchase reward"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Points added successfully",
  "data": {
    "transaction": {
      "id": 123,
      "customerId": 1,
      "type": "earned",
      "points": 250,
      "amount": "$500.00",
      "date": "2025-01-15T10:30:00Z"
    },
    "customer": {
      "id": 1,
      "name": "Ahmed Mohammed",
      "totalPoints": 2750,
      "tier": "Silver"
    }
  }
}
```

### Redeem Points
- **Endpoint**: `POST /api/points/redeem`
- **Description**: Deduct points from customer account for redemption
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "customerId": 1,
  "points": 500,
  "cashValue": 25.00,
  "description": "Cash redemption"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Points redeemed successfully",
  "data": {
    "transaction": {
      "id": 124,
      "customerId": 1,
      "type": "redeemed",
      "points": -500,
      "amount": "$25.00",
      "date": "2025-01-15T10:30:00Z"
    },
    "customer": {
      "id": 1,
      "name": "Ahmed Mohammed",
      "totalPoints": 2250,
      "tier": "Silver"
    }
  }
}
```

### Deduct Points (Refund)
- **Endpoint**: `POST /api/points/deduct`
- **Description**: Remove points due to refund
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "customerId": 1,
  "refundAmount": 100.00,
  "reason": "Product return refund"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Points deducted successfully",
  "data": {
    "pointsDeducted": 200,
    "transaction": {
      "id": 125,
      "customerId": 1,
      "type": "deducted",
      "points": -200,
      "amount": "$100.00",
      "date": "2025-01-15T10:30:00Z",
      "reason": "Product return refund"
    },
    "customer": {
      "id": 1,
      "name": "Ahmed Mohammed",
      "totalPoints": 2050,
      "tier": "Silver"
    }
  }
}
```

---

## 6. Campaigns API

### Get All Campaigns
- **Endpoint**: `GET /api/campaigns`
- **Description**: Get all loyalty campaigns
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Winter Golden Campaign",
      "description": "Earn double points during winter season",
      "startDate": "2025-01-01",
      "endDate": "2025-03-31",
      "earnRate": "2x points/$",
      "redeemRate": "$0.05/point",
      "status": "Active"
    }
  ]
}
```

### Create Campaign
- **Endpoint**: `POST /api/campaigns`
- **Description**: Create new campaign
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "name": "Spring Bonus Campaign",
  "description": "Extra points for spring purchases",
  "startDate": "2025-04-01",
  "endDate": "2025-06-30",
  "earnRate": "1.5x points/$",
  "redeemRate": "$0.04/point"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "id": 2,
    "name": "Spring Bonus Campaign",
    "description": "Extra points for spring purchases",
    "startDate": "2025-04-01",
    "endDate": "2025-06-30",
    "earnRate": "1.5x points/$",
    "redeemRate": "$0.04/point",
    "status": "Active"
  }
}
```

### Update Campaign
- **Endpoint**: `PUT /api/campaigns/{id}`
- **Description**: Update campaign details
- **Authentication**: Required (Admin)

**Request Format:**
```json
{
  "name": "Updated Campaign Name",
  "description": "Updated description",
  "startDate": "2025-04-01",
  "endDate": "2025-06-30",
  "earnRate": "2x points/$",
  "redeemRate": "$0.05/point"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Campaign updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Campaign Name",
    "description": "Updated description",
    "startDate": "2025-04-01",
    "endDate": "2025-06-30",
    "earnRate": "2x points/$",
    "redeemRate": "$0.05/point",
    "status": "Active"
  }
}
```

### Delete Campaign
- **Endpoint**: `DELETE /api/campaigns/{id}`
- **Description**: Delete campaign
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

---

## 7. Transactions API

### Get All Transactions
- **Endpoint**: `GET /api/transactions`
- **Description**: Get all transactions with filters
- **Authentication**: Required (Admin)

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `type` (optional): 'earned', 'redeemed', 'deducted'
- `customer_id` (optional): Filter by customer
- `date_from` (optional): Start date filter
- `date_to` (optional): End date filter

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customerId": 1,
      "customerName": "Ahmed Mohammed",
      "type": "earned",
      "points": 250,
      "amount": "$500",
      "date": "2025-01-15T10:30:00Z",
      "description": "Purchase reward"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_items": 100
  }
}
```

### Delete Transaction
- **Endpoint**: `DELETE /api/transactions/{id}`
- **Description**: Delete transaction record
- **Authentication**: Required (Admin)

**Response Format:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

---

## 8. Customer Portal API

### Customer Registration
- **Endpoint**: `POST /api/customer/register`
- **Description**: Self-registration for customers
- **Authentication**: Not Required

**Request Format:**
```json
{
  "fullName": "Ahmed Mohammed",
  "phoneNumber": "0551234567",
  "email": "ahmed@example.com",
  "gender": "Male",
  "pinCode": "1234",
  "confirmPin": "1234"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "name": "Ahmed Mohammed",
    "phone": "0551234567",
    "email": "ahmed@example.com",
    "tier": "Bronze",
    "points": 0
  }
}
```

### Customer Login
- **Endpoint**: `POST /api/customer/login`
- **Description**: Customer authentication
- **Authentication**: Not Required

**Request Format:**
```json
{
  "phoneNumber": "0551234567",
  "pinCode": "1234"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "customer": {
      "id": 1,
      "name": "Ahmed Mohammed",
      "phone": "0551234567",
      "email": "ahmed@example.com",
      "points": 2500,
      "tier": "Silver",
      "cashValue": "$125.00"
    }
  }
}
```

### Get Customer Profile
- **Endpoint**: `GET /api/customer/profile`
- **Description**: Get customer profile and transaction history
- **Authentication**: Required (Customer Token)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": 1,
      "name": "Ahmed Mohammed",
      "phone": "0551234567",
      "email": "ahmed@example.com",
      "points": 2500,
      "tier": "Silver",
      "cashValue": "$125.00",
      "joined": "2025-01-15T10:30:00Z"
    },
    "transactions": [
      {
        "id": 1,
        "type": "earned",
        "points": 250,
        "amount": "$500",
        "date": "2025-01-15T10:30:00Z",
        "description": "Purchase reward"
      },
      {
        "id": 2,
        "type": "redeemed",
        "points": -500,
        "amount": "$25",
        "date": "2025-01-14T15:20:00Z",
        "description": "Cash redemption"
      }
    ]
  }
}
```

### Request Point Redemption
- **Endpoint**: `POST /api/customer/redeem-request`
- **Description**: Submit redemption request
- **Authentication**: Required (Customer Token)

**Request Format:**
```json
{
  "points": 1000,
  "redemptionMethod": "cash"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Redemption request submitted successfully",
  "data": {
    "requestId": 123,
    "points": 1000,
    "cashValue": "$50.00",
    "status": "pending",
    "submittedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## Error Response Format

All API endpoints should return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

---

## Frontend Implementation Notes

1. **Base API URL**: Configure in environment variable `REACT_APP_API_URL`
2. **Token Storage**: Admin tokens stored in `localStorage` as `admin_token`
3. **Customer Tokens**: Stored in `localStorage` as `customer_token`
4. **Real-time Updates**: All forms update UI immediately after successful API calls
5. **Error Handling**: Console logging implemented, toast notifications can be added
6. **Loading States**: Loading indicators should be shown during API calls
7. **Offline Fallback**: Mock data provided for development when API is unavailable

## Security Considerations

1. **CORS**: Configure Laravel to accept requests from your frontend domain
2. **Rate Limiting**: Implement rate limiting on sensitive endpoints
3. **Input Validation**: Validate all input data on Laravel backend
4. **Token Expiration**: Implement token refresh mechanism
5. **HTTPS**: Use HTTPS in production
6. **SQL Injection**: Use Laravel's Eloquent ORM to prevent SQL injection

This documentation provides a complete blueprint for connecting your React frontend with your Laravel backend. All endpoints are structured to provide consistent responses and handle real-time updates efficiently.
