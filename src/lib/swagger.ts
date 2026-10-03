import type { OpenAPIV3 } from 'openapi-types';

const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.3',

  info: {
    title: 'E-Commerce Backend API',
    description:
      'Authentication, users, products, categories, cart, coupons, orders, payments, reviews, sessions and admin APIs',
    version: '1.0.0',
  },

  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],

  tags: [
    {
      name: 'Authentication',
      description: 'Authentication and profile APIs',
    },
    {
      name: 'Sessions',
      description: 'Session and device management APIs',
    },
    {
      name: 'Categories',
      description: 'Public category APIs',
    },
    {
      name: 'Products',
      description: 'Public product APIs',
    },
    {
      name: 'Likes',
      description: 'Product likes and favorites APIs',
    },
    {
      name: 'Cart',
      description: 'Shopping cart APIs',
    },
    {
      name: 'Orders',
      description: 'Customer order APIs',
    },
    {
      name: 'Payments',
      description: 'Customer payment APIs',
    },
    {
      name: 'Reviews',
      description: 'Product review APIs',
    },
    {
      name: 'Admin',
      description: 'Admin-only APIs',
    },
  ],

  paths: {
    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    '/api/auth/send-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Send OTP',
        description: 'Creates a user if necessary and sends an OTP code.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SendOtpRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SendOtpResponse',
                },
              },
            },
          },
          400: {
            description: 'Phone number is required',
          },
          429: {
            description: 'Too many OTP requests',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/auth/verify-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Verify OTP',
        description: 'Verifies the OTP and creates access and refresh tokens.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VerifyOtpRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP verified successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/VerifyOtpResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid or expired OTP',
          },
          404: {
            description: 'User not found',
          },
          429: {
            description: 'Too many verification attempts',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/auth/check-profile': {
      post: {
        tags: ['Authentication'],
        summary: 'Complete user profile',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CheckProfileRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile completed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CheckProfileResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid profile data',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'Phone number is not verified',
          },
          409: {
            description: 'Email already belongs to another user',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'User profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MeResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        security: [{ refreshTokenCookie: [] }],
        responses: {
          200: {
            description: 'Tokens refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessageResponse',
                },
              },
            },
          },
          401: {
            description: 'Invalid or expired refresh token',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout current device',
        security: [{ refreshTokenCookie: [] }],
        responses: {
          200: {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessageResponse',
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/auth/logout-all': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout from all devices',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Logged out from all devices successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LogoutAllResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       SESSIONS
    ===================================================== */

    '/api/auth/sessions': {
      get: {
        tags: ['Sessions'],
        summary: 'Get user sessions',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Sessions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionsResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/auth/sessions/{id}': {
      delete: {
        tags: ['Sessions'],
        summary: 'Delete a session',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Session deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessageResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid session ID',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Session not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       CATEGORIES
    ===================================================== */

    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get categories',
        responses: {
          200: {
            description: 'Categories retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CategoriesResponse',
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by ID',
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Category retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CategoryResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid category ID',
          },
          404: {
            description: 'Category not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       PRODUCTS
    ===================================================== */

    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get products',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 12,
            },
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'category',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'brand',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'minPrice',
            in: 'query',
            schema: {
              type: 'number',
              minimum: 0,
            },
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: {
              type: 'number',
              minimum: 0,
            },
          },
          {
            name: 'sort',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['newest', 'oldest', 'price-asc', 'price-desc', 'rating'],
            },
          },
        ],
        responses: {
          200: {
            description: 'Products retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductsResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid query parameters',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Product retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid product ID',
          },
          404: {
            description: 'Product not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/products/slug/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by slug',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Product retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductResponse',
                },
              },
            },
          },
          404: {
            description: 'Product not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/products/liked': {
      get: {
        tags: ['Likes'],
        summary: 'Get liked products',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Liked products retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductsResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/products/like/{id}': {
      post: {
        tags: ['Likes'],
        summary: 'Toggle product like',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Like status changed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LikeResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid product ID',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      delete: {
        tags: ['Likes'],
        summary: 'Remove product from likes',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Product removed from likes',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LikeResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       CART
    ===================================================== */

    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get current cart',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Cart retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CartResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      post: {
        tags: ['Cart'],
        summary: 'Add product to cart',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddCartRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Product added to cart',
          },
          400: {
            description: 'Invalid product or quantity',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product not found',
          },
          409: {
            description: 'Insufficient stock',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/cart/{productId}': {
      delete: {
        tags: ['Cart'],
        summary: 'Remove product from cart',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Product removed from cart',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product not found in cart',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/cart/{productId}/increase': {
      patch: {
        tags: ['Cart'],
        summary: 'Increase cart product quantity',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Quantity increased successfully',
          },
          400: {
            description: 'Invalid product ID',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product not found in cart',
          },
          409: {
            description: 'Insufficient stock',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/cart/{productId}/decrease': {
      patch: {
        tags: ['Cart'],
        summary: 'Decrease cart product quantity',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Quantity decreased successfully',
          },
          400: {
            description: 'Invalid product ID',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product not found in cart',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/cart/coupon': {
      post: {
        tags: ['Cart'],
        summary: 'Apply coupon to cart',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApplyCouponRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Coupon applied successfully',
          },
          400: {
            description: 'Invalid or expired coupon',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Coupon not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      delete: {
        tags: ['Cart'],
        summary: 'Remove coupon from cart',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Coupon removed successfully',
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ORDERS
    ===================================================== */

    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get current user orders',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED',
              ],
            },
          },
        ],
        responses: {
          200: {
            description: 'Orders retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrdersResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      post: {
        tags: ['Orders'],
        summary: 'Create order',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateOrderRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid order data or empty cart',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product or user not found',
          },
          409: {
            description: 'Insufficient stock',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/orders/{orderId}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order details',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Order retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid order ID',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Order not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      patch: {
        tags: ['Orders'],
        summary: 'Cancel order',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Order cancelled successfully',
          },
          400: {
            description: 'Order cannot be cancelled',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Order not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       PAYMENTS
    ===================================================== */

    '/api/payments': {
      post: {
        tags: ['Payments'],
        summary: 'Create mock payment',
        description:
          'Creates a mock payment for an existing order. No real payment gateway is used.',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreatePaymentRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Payment created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreatePaymentResponse',
                },
              },
            },
          },
          400: {
            description:
              'Invalid order, cancelled order or payment already exists',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Order not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/payments/confirm': {
      post: {
        tags: ['Payments'],
        summary: 'Confirm mock payment',
        description:
          'Confirms a mock payment and changes the related order status to PROCESSING.',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConfirmPaymentRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Payment confirmed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ConfirmPaymentResponse',
                },
              },
            },
          },
          400: {
            description: 'Payment cannot be confirmed',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Payment or order not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       REVIEWS
    ===================================================== */

    '/api/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get product reviews',
        parameters: [
          {
            name: 'productId',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: 'Reviews retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ReviewsResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid product ID',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      post: {
        tags: ['Reviews'],
        summary: 'Create review',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateReviewRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Review created successfully',
          },
          400: {
            description: 'Invalid review data',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Product not found',
          },
          409: {
            description: 'User has already reviewed this product',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/reviews/{id}': {
      get: {
        tags: ['Reviews'],
        summary: 'Get review by ID',
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Review retrieved successfully',
          },
          400: {
            description: 'Invalid review ID',
          },
          404: {
            description: 'Review not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      patch: {
        tags: ['Reviews'],
        summary: 'Update review',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateReviewRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Review updated successfully',
          },
          400: {
            description: 'Invalid review data',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'User is not allowed to update this review',
          },
          404: {
            description: 'Review not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      delete: {
        tags: ['Reviews'],
        summary: 'Delete review',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Review deleted successfully',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'User is not allowed to delete this review',
          },
          404: {
            description: 'Review not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN USERS
    ===================================================== */

    '/api/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Get all users',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsersResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/users/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get user by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'User retrieved successfully',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      patch: {
        tags: ['Admin'],
        summary: 'Update user',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AdminUpdateUserRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated successfully',
          },
          400: {
            description: 'Invalid user data',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/users/{id}/role': {
      patch: {
        tags: ['Admin'],
        summary: 'Change user role',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChangeRoleRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User role changed successfully',
          },
          400: {
            description: 'Invalid role',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/users/{id}/status': {
      patch: {
        tags: ['Admin'],
        summary: 'Change user status',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChangeStatusRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User status changed successfully',
          },
          400: {
            description: 'Invalid status',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN CATEGORIES
    ===================================================== */

    '/api/admin/categories': {
      get: {
        tags: ['Admin'],
        summary: 'Get all categories',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Categories retrieved successfully',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      post: {
        tags: ['Admin'],
        summary: 'Create category',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Category created successfully',
          },
          400: {
            description: 'Invalid category data',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          409: {
            description: 'Category already exists',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/categories/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get category by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Category retrieved successfully',
          },
          404: {
            description: 'Category not found',
          },
        },
      },

      patch: {
        tags: ['Admin'],
        summary: 'Update category',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Category updated successfully',
          },
          400: {
            description: 'Invalid category data',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Category not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      delete: {
        tags: ['Admin'],
        summary: 'Delete category',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Category deleted successfully',
          },
          400: {
            description: 'Category cannot be deleted',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Category not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN PRODUCTS
    ===================================================== */

    '/api/admin/products': {
      get: {
        tags: ['Admin'],
        summary: 'Get all products',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Products retrieved successfully',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      post: {
        tags: ['Admin'],
        summary: 'Create product',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Product created successfully',
          },
          400: {
            description: 'Invalid product data',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'ADMIN role required',
          },
          409: {
            description: 'Product slug already exists',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/products/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get product by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Product retrieved successfully',
          },
          404: {
            description: 'Product not found',
          },
        },
      },

      patch: {
        tags: ['Admin'],
        summary: 'Update product',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Product updated successfully',
          },
          400: {
            description: 'Invalid product data',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Product not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      delete: {
        tags: ['Admin'],
        summary: 'Delete product',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Product deleted successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Product not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/products/{id}/discount': {
      patch: {
        tags: ['Admin'],
        summary: 'Update product discount',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DiscountRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Product discount updated successfully',
          },
          400: {
            description: 'Invalid discount',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Product not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN COUPONS
    ===================================================== */

    '/api/admin/coupons': {
      get: {
        tags: ['Admin'],
        summary: 'Get all coupons',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Coupons retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      post: {
        tags: ['Admin'],
        summary: 'Create coupon',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CouponRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Coupon created successfully',
          },
          400: {
            description: 'Invalid coupon data',
          },
          403: {
            description: 'ADMIN role required',
          },
          409: {
            description: 'Coupon code already exists',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/coupons/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get coupon by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Coupon retrieved successfully',
          },
          404: {
            description: 'Coupon not found',
          },
        },
      },

      patch: {
        tags: ['Admin'],
        summary: 'Update coupon',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CouponRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Coupon updated successfully',
          },
          400: {
            description: 'Invalid coupon data',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Coupon not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      delete: {
        tags: ['Admin'],
        summary: 'Delete coupon',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Coupon deleted successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Coupon not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN ORDERS
    ===================================================== */

    '/api/admin/orders': {
      get: {
        tags: ['Admin'],
        summary: 'Get all orders',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED',
              ],
            },
          },
        ],
        responses: {
          200: {
            description: 'Orders retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/orders/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get order by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Order retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Order not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      patch: {
        tags: ['Admin'],
        summary: 'Update admin order',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Order updated successfully',
          },
          400: {
            description: 'Invalid order data',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Order not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/orders/{id}/status': {
      patch: {
        tags: ['Admin'],
        summary: 'Change order status',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/OrderStatusRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order status updated successfully',
          },
          400: {
            description: 'Invalid order status',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Order not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN PAYMENTS
    ===================================================== */

    '/api/admin/payments': {
      get: {
        tags: ['Admin'],
        summary: 'Get all payments',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['UNCOMPLETED', 'COMPLETED'],
            },
          },
          {
            name: 'isPaid',
            in: 'query',
            schema: {
              type: 'boolean',
            },
          },
        ],
        responses: {
          200: {
            description: 'Payments retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/payments/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get payment by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Payment retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Payment not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN REVIEWS
    ===================================================== */

    '/api/admin/reviews': {
      get: {
        tags: ['Admin'],
        summary: 'Get all reviews',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
            },
          },
        ],
        responses: {
          200: {
            description: 'Reviews retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/reviews/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get review by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Review retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Review not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/reviews/{id}/status': {
      patch: {
        tags: ['Admin'],
        summary: 'Change review status',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ReviewStatusRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Review status updated successfully',
          },
          400: {
            description: 'Invalid review status',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Review not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN DASHBOARD
    ===================================================== */

    '/api/admin/dashboard': {
      get: {
        tags: ['Admin'],
        summary: 'Get dashboard statistics',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Dashboard statistics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DashboardResponse',
                },
              },
            },
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    /* =====================================================
       ADMIN TICKETS
    ===================================================== */

    '/api/admin/tickets': {
      get: {
        tags: ['Admin'],
        summary: 'Get all tickets',
        security: [{ accessTokenCookie: [] }],
        responses: {
          200: {
            description: 'Tickets retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },

      post: {
        tags: ['Admin'],
        summary: 'Create ticket',
        security: [{ accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TicketRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Ticket created successfully',
          },
          400: {
            description: 'Invalid ticket data',
          },
          403: {
            description: 'ADMIN role required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/tickets/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get ticket by ID',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Ticket retrieved successfully',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Ticket not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },

    '/api/admin/tickets/{id}/{status}': {
      patch: {
        tags: ['Admin'],
        summary: 'Change ticket status',
        security: [{ accessTokenCookie: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'status',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Ticket status updated successfully',
          },
          400: {
            description: 'Invalid ticket status',
          },
          403: {
            description: 'ADMIN role required',
          },
          404: {
            description: 'Ticket not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },
  },

  /* =======================================================
     COMPONENTS
  ======================================================= */

  components: {
    securitySchemes: {
      accessTokenCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'JWT access token stored in an HttpOnly cookie.',
      },

      refreshTokenCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description: 'JWT refresh token stored in an HttpOnly cookie.',
      },
    },

    parameters: {
      ObjectId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'MongoDB ObjectId',
        schema: {
          type: 'string',
          example: '65f123456789abcdef123456',
        },
      },
    },

    schemas: {
      /* =====================================================
         AUTH REQUESTS
      ===================================================== */

      SendOtpRequest: {
        type: 'object',
        required: ['phoneNumber'],
        properties: {
          phoneNumber: {
            type: 'string',
            example: '09123456789',
          },
        },
      },

      VerifyOtpRequest: {
        type: 'object',
        required: ['phoneNumber', 'otp'],
        properties: {
          phoneNumber: {
            type: 'string',
            example: '09123456789',
          },
          otp: {
            type: 'string',
            example: '123456',
          },
        },
      },

      CheckProfileRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            example: 'Ali Ahmadi',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ali@example.com',
          },
        },
      },

      /* =====================================================
         USER
      ===================================================== */

      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '65f123456789abcdef123456',
          },
          phoneNumber: {
            type: 'string',
            example: '09123456789',
          },
          name: {
            type: 'string',
            nullable: true,
          },
          email: {
            type: 'string',
            nullable: true,
            format: 'email',
          },
          biography: {
            type: 'string',
          },
          avatarUrl: {
            type: 'string',
            nullable: true,
          },
          isVerifiedPhoneNumber: {
            type: 'boolean',
          },
          isActive: {
            type: 'boolean',
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN'],
          },
          likedProducts: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          Products: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      /* =====================================================
         SESSION
      ===================================================== */

      Session: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          userAgent: {
            type: 'string',
            nullable: true,
          },
          ipAddress: {
            type: 'string',
            nullable: true,
          },
          expiresAt: {
            type: 'string',
            format: 'date-time',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
          isCurrent: {
            type: 'boolean',
          },
        },
      },

      /* =====================================================
         CATEGORY
      ===================================================== */

      Category: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          englishTitle: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['product', 'comment', 'post', 'ticket'],
          },
          parentId: {
            type: 'string',
            nullable: true,
          },
          icon: {
            type: 'string',
            nullable: true,
          },
          iconLg: {
            type: 'string',
            nullable: true,
          },
        },
      },

      CategoryRequest: {
        type: 'object',
        required: ['title', 'englishTitle'],
        properties: {
          title: {
            type: 'string',
            example: 'موبایل',
          },
          englishTitle: {
            type: 'string',
            example: 'Mobile',
          },
          description: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['product', 'comment', 'post', 'ticket'],
          },
          parentId: {
            type: 'string',
            nullable: true,
          },
          icon: {
            type: 'string',
            nullable: true,
          },
          iconLg: {
            type: 'string',
            nullable: true,
          },
        },
      },

      /* =====================================================
         PRODUCT
      ===================================================== */

      Product: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          slug: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
          imageLink: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          offPrice: {
            type: 'number',
          },
          discount: {
            type: 'number',
            minimum: 0,
            maximum: 100,
          },
          brand: {
            type: 'string',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          rating: {
            type: 'number',
          },
          numReviews: {
            type: 'integer',
          },
          countInStock: {
            type: 'integer',
          },
          likes: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      ProductRequest: {
        type: 'object',
        required: [
          'title',
          'description',
          'slug',
          'category',
          'imageLink',
          'price',
          'offPrice',
          'brand',
          'countInStock',
        ],
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          slug: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
          imageLink: {
            type: 'string',
            format: 'uri',
          },
          price: {
            type: 'number',
            minimum: 0,
          },
          offPrice: {
            type: 'number',
            minimum: 0,
          },
          discount: {
            type: 'number',
            minimum: 0,
            maximum: 100,
          },
          brand: {
            type: 'string',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          countInStock: {
            type: 'integer',
            minimum: 0,
          },
        },
      },

      DiscountRequest: {
        type: 'object',
        required: ['discount'],
        properties: {
          discount: {
            type: 'number',
            minimum: 0,
            maximum: 100,
          },
        },
      },

      /* =====================================================
         CART
      ===================================================== */

      CartProduct: {
        type: 'object',
        properties: {
          product: {
            $ref: '#/components/schemas/Product',
          },
          quantity: {
            type: 'integer',
            minimum: 1,
          },
        },
      },

      Cart: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CartProduct',
            },
          },
          coupon: {
            $ref: '#/components/schemas/Coupon',
          },
        },
      },

      AddCartRequest: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: {
            type: 'string',
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
      },

      ApplyCouponRequest: {
        type: 'object',
        required: ['code'],
        properties: {
          code: {
            type: 'string',
            example: 'WELCOME20',
          },
        },
      },

      /* =====================================================
         COUPON
      ===================================================== */

      Coupon: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          code: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['fixedProduct', 'percent'],
          },
          amount: {
            type: 'number',
          },
          expireDate: {
            type: 'string',
            format: 'date-time',
          },
          isActive: {
            type: 'boolean',
          },
          usageCount: {
            type: 'integer',
          },
          usageLimit: {
            type: 'integer',
          },
          productIds: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },

      CouponRequest: {
        type: 'object',
        required: ['code', 'type', 'amount', 'expireDate', 'usageLimit'],
        properties: {
          code: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['fixedProduct', 'percent'],
          },
          amount: {
            type: 'number',
            minimum: 0,
          },
          expireDate: {
            type: 'string',
            format: 'date-time',
          },
          isActive: {
            type: 'boolean',
            default: true,
          },
          usageLimit: {
            type: 'integer',
            minimum: 1,
          },
          productIds: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },

      /* =====================================================
         ORDER
      ===================================================== */

      OrderAddress: {
        type: 'object',
        required: [
          'fullName',
          'phoneNumber',
          'province',
          'city',
          'address',
          'postalCode',
        ],
        properties: {
          fullName: {
            type: 'string',
          },
          phoneNumber: {
            type: 'string',
          },
          province: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          address: {
            type: 'string',
          },
          postalCode: {
            type: 'string',
          },
        },
      },

      OrderItem: {
        type: 'object',
        properties: {
          product: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          imageLink: {
            type: 'string',
          },
          quantity: {
            type: 'integer',
          },
          price: {
            type: 'number',
          },
          discount: {
            type: 'number',
          },
          offPrice: {
            type: 'number',
          },
        },
      },

      Order: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          user: {
            type: 'string',
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem',
            },
          },
          address: {
            $ref: '#/components/schemas/OrderAddress',
          },
          coupon: {
            type: 'string',
            nullable: true,
          },
          subtotal: {
            type: 'number',
          },
          discountAmount: {
            type: 'number',
          },
          shippingCost: {
            type: 'number',
          },
          totalAmount: {
            type: 'number',
          },
          status: {
            type: 'string',
            enum: [
              'PENDING',
              'PROCESSING',
              'SHIPPED',
              'DELIVERED',
              'CANCELLED',
            ],
          },
          payment: {
            type: 'string',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      CreateOrderRequest: {
        type: 'object',
        required: ['address'],
        properties: {
          address: {
            $ref: '#/components/schemas/OrderAddress',
          },
        },
      },

      OrderStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: [
              'PENDING',
              'PROCESSING',
              'SHIPPED',
              'DELIVERED',
              'CANCELLED',
            ],
          },
        },
      },

      /* =====================================================
         PAYMENT
      ===================================================== */

      Payment: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          invoiceNumber: {
            type: 'string',
            nullable: true,
          },
          paymentMethod: {
            type: 'string',
            example: 'MOCK',
          },
          amount: {
            type: 'number',
          },
          description: {
            type: 'string',
          },
          refId: {
            type: 'string',
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['UNCOMPLETED', 'COMPLETED'],
          },
          isPaid: {
            type: 'boolean',
          },
          authority: {
            type: 'string',
            nullable: true,
          },
          user: {
            type: 'string',
          },
          paymentDate: {
            type: 'string',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      CreatePaymentRequest: {
        type: 'object',
        required: ['orderId'],
        properties: {
          orderId: {
            type: 'string',
          },
        },
      },

      CreatePaymentResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          paymentId: {
            type: 'string',
          },
          orderId: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['UNCOMPLETED', 'COMPLETED'],
          },
          amount: {
            type: 'number',
          },
        },
      },

      ConfirmPaymentRequest: {
        type: 'object',
        required: ['paymentId'],
        properties: {
          paymentId: {
            type: 'string',
          },
        },
      },

      ConfirmPaymentResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          paymentId: {
            type: 'string',
          },
          orderId: {
            type: 'string',
          },
          paymentStatus: {
            type: 'string',
            enum: ['COMPLETED'],
          },
          isPaid: {
            type: 'boolean',
          },
          orderStatus: {
            type: 'string',
            enum: ['PROCESSING'],
          },
        },
      },

      /* =====================================================
         REVIEW
      ===================================================== */

      Review: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          user: {
            type: 'string',
          },
          product: {
            type: 'string',
          },
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
          },
          comment: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      CreateReviewRequest: {
        type: 'object',
        required: ['productId', 'rating', 'comment'],
        properties: {
          productId: {
            type: 'string',
          },
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
          },
          comment: {
            type: 'string',
          },
        },
      },

      UpdateReviewRequest: {
        type: 'object',
        properties: {
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
          },
          comment: {
            type: 'string',
          },
        },
      },

      ReviewStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
          },
        },
      },

      /* =====================================================
         ADMIN USER
      ===================================================== */

      AdminUpdateUserRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          biography: {
            type: 'string',
          },
          avatarUrl: {
            type: 'string',
            nullable: true,
          },
        },
      },

      ChangeRoleRequest: {
        type: 'object',
        required: ['role'],
        properties: {
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN'],
          },
        },
      },

      ChangeStatusRequest: {
        type: 'object',
        required: ['isActive'],
        properties: {
          isActive: {
            type: 'boolean',
          },
        },
      },

      /* =====================================================
         TICKET
      ===================================================== */

      TicketRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          status: {
            type: 'string',
          },
        },
      },

      /* =====================================================
         GENERIC RESPONSES
      ===================================================== */

      MessageResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
      },

      SendOtpResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          userId: {
            type: 'string',
          },
          otp: {
            type: 'string',
            description:
              'Demo only. OTP should normally be sent through an SMS provider.',
          },
        },
      },

      VerifyOtpResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          userId: {
            type: 'string',
          },
          isVerifiedPhoneNumber: {
            type: 'boolean',
          },
          isActive: {
            type: 'boolean',
          },
        },
      },

      CheckProfileResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          userId: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          isVerifiedPhoneNumber: {
            type: 'boolean',
          },
          isActive: {
            type: 'boolean',
          },
        },
      },

      MeResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },

      SessionsResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          sessions: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Session',
            },
          },
        },
      },

      LogoutAllResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          deletedSessions: {
            type: 'integer',
          },
        },
      },

      UsersResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },

      CategoriesResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          categories: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Category',
            },
          },
        },
      },

      CategoryResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          category: {
            $ref: '#/components/schemas/Category',
          },
        },
      },

      ProductsResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          products: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product',
            },
          },
          pagination: {
            $ref: '#/components/schemas/Pagination',
          },
        },
      },

      ProductResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          product: {
            $ref: '#/components/schemas/Product',
          },
        },
      },

      LikeResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          productId: {
            type: 'string',
          },
          isLiked: {
            type: 'boolean',
          },
          likesCount: {
            type: 'integer',
          },
        },
      },

      CartResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          cart: {
            $ref: '#/components/schemas/Cart',
          },
        },
      },

      OrdersResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          orders: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Order',
            },
          },
          pagination: {
            $ref: '#/components/schemas/Pagination',
          },
        },
      },

      OrderResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          order: {
            $ref: '#/components/schemas/Order',
          },
        },
      },

      ReviewsResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          reviews: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Review',
            },
          },
          pagination: {
            $ref: '#/components/schemas/Pagination',
          },
        },
      },

      DashboardResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          statistics: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },

      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
          },
          limit: {
            type: 'integer',
          },
          total: {
            type: 'integer',
          },
          totalPages: {
            type: 'integer',
          },
          hasNextPage: {
            type: 'boolean',
          },
          hasPreviousPage: {
            type: 'boolean',
          },
        },
      },
    },
  },
};

export default swaggerDocument;
