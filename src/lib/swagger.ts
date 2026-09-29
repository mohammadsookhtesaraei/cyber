import type { OpenAPIV3 } from "openapi-types";

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.3",

  info: {
    title: "Authentication API",
    description:
      "Authentication, session management and admin APIs",
    version: "1.0.0",
  },

  servers: [
    {
      url: "http://localhost:3000",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description: "Authentication and profile APIs",
    },
    {
      name: "Sessions",
      description: "Session and device management APIs",
    },
    {
      name: "Admin",
      description: "Admin-only APIs",
    },
  ],

  paths: {
    // =========================================
    // AUTHENTICATION
    // =========================================

    "/api/auth/send-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Send OTP",
        description:
          "Creates a user if necessary and sends an OTP code.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SendOtpRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SendOtpResponse",
                },
              },
            },
          },

          400: {
            description: "Phone number is required",
          },

          429: {
            description:
              "Too many OTP requests",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/auth/verify-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Verify OTP",
        description:
          "Verifies the OTP and creates access and refresh tokens.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VerifyOtpRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "OTP verified successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/VerifyOtpResponse",
                },
              },
            },
          },

          400: {
            description:
              "Invalid or expired OTP",
          },

          404: {
            description: "User not found",
          },

          429: {
            description:
              "Too many verification attempts",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/auth/check-profile": {
      post: {
        tags: ["Authentication"],
        summary: "Complete user profile",
        description:
          "Completes the user's profile after phone number verification.",
        security: [
          {
            accessTokenCookie: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CheckProfileRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "Profile completed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CheckProfileResponse",
                },
              },
            },
          },

          400: {
            description:
              "Invalid profile data",
          },

          401: {
            description:
              "Access token is missing, invalid, or expired",
          },

          403: {
            description:
              "Phone number is not verified",
          },

          409: {
            description:
              "Email already belongs to another user",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/auth/profile": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user profile",
        description:
          "Returns the authenticated user's profile.",
        security: [
          {
            accessTokenCookie: [],
          },
        ],
        responses: {
          200: {
            description:
              "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MeResponse",
                },
              },
            },
          },

          401: {
            description:
              "Access token is missing, invalid, or expired",
          },

          404: {
            description: "User not found",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/auth/refresh-token": {
      post: {
        tags: ["Authentication"],
        summary: "Refresh access token",
        description:
          "Rotates the refresh token and creates a new access token.",
        security: [
          {
            refreshTokenCookie: [],
          },
        ],
        responses: {
          200: {
            description:
              "Tokens refreshed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },

          401: {
            description:
              "Refresh token is missing, invalid, expired, or session not found",
          },

          404: {
            description: "User not found",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout current device",
        description:
          "Deletes the current session and removes authentication cookies.",
        security: [
          {
            refreshTokenCookie: [],
          },
        ],
        responses: {
          200: {
            description:
              "Logout successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/auth/logout-all": {
      post: {
        tags: ["Authentication"],
        summary: "Logout from all devices",
        description:
          "Deletes all sessions belonging to the authenticated user.",
        security: [
          {
            accessTokenCookie: [],
          },
        ],
        responses: {
          200: {
            description:
              "Logged out from all devices successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LogoutAllResponse",
                },
              },
            },
          },

          401: {
            description:
              "Access token is missing, invalid, or expired",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    // =========================================
    // SESSIONS
    // =========================================

    "/api/auth/sessions": {
      get: {
        tags: ["Sessions"],
        summary: "Get user sessions",
        description:
          "Returns all active sessions of the authenticated user.",
        security: [
          {
            accessTokenCookie: [],
          },
        ],
        responses: {
          200: {
            description:
              "Sessions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SessionsResponse",
                },
              },
            },
          },

          401: {
            description:
              "Access token is missing, invalid, or expired",
          },

          404: {
            description: "User not found",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/auth/sessions/{id}": {
      delete: {
        tags: ["Sessions"],
        summary: "Delete a session",
        description:
          "Deletes another active session of the authenticated user.",
        security: [
          {
            accessTokenCookie: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Session ID",
            schema: {
              type: "string",
              example: "65f123456789abcdef123456",
            },
          },
        ],
        responses: {
          200: {
            description:
              "Session deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },

          400: {
            description:
              "Invalid session ID or attempting to delete current session",
          },

          401: {
            description:
              "Access token is missing, invalid, or expired",
          },

          404: {
            description: "Session not found",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },

    // =========================================
    // ADMIN
    // =========================================

    "/api/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users",
        description:
          "Returns all users. Only ADMIN users can access this endpoint.",
        security: [
          {
            accessTokenCookie: [],
          },
        ],
        responses: {
          200: {
            description:
              "Users retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsersResponse",
                },
              },
            },
          },

          401: {
            description:
              "Access token is missing, invalid, or expired",
          },

          403: {
            description:
              "Access denied. ADMIN role is required.",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },

  // =========================================
  // COMPONENTS
  // =========================================

  components: {
    securitySchemes: {
      accessTokenCookie: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description:
          "JWT access token stored in an HttpOnly cookie.",
      },

      refreshTokenCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description:
          "JWT refresh token stored in an HttpOnly cookie.",
      },
    },

    schemas: {
      // =====================================
      // AUTH REQUESTS
      // =====================================

      SendOtpRequest: {
        type: "object",
        required: ["phoneNumber"],
        properties: {
          phoneNumber: {
            type: "string",
            example: "09123456789",
            description:
              "User phone number",
          },
        },
      },

      VerifyOtpRequest: {
        type: "object",
        required: ["phoneNumber", "otp"],
        properties: {
          phoneNumber: {
            type: "string",
            example: "09123456789",
          },

          otp: {
            type: "string",
            example: "123456",
            description:
              "Six digit OTP code",
          },
        },
      },

      CheckProfileRequest: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            example: "Ali Ahmadi",
          },

          email: {
            type: "string",
            format: "email",
            example: "ali@example.com",
          },
        },
      },

      // =====================================
      // USER
      // =====================================

      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "65f123456789abcdef123456",
          },

          phoneNumber: {
            type: "string",
            example: "09123456789",
          },

          name: {
            type: "string",
            nullable: true,
            example: "Ali Ahmadi",
          },

          email: {
            type: "string",
            nullable: true,
            example: "ali@example.com",
          },

          biography: {
            type: "string",
            example: "Frontend developer",
          },

          avatarUrl: {
            type: "string",
            nullable: true,
            example:
              "https://example.com/avatar.jpg",
          },

          isVerifiedPhoneNumber: {
            type: "boolean",
            example: true,
          },

          isActive: {
            type: "boolean",
            example: true,
          },

          role: {
            type: "string",
            enum: ["USER", "ADMIN"],
            example: "USER",
          },

          likedProducts: {
            type: "array",
            items: {
              type: "string",
            },
          },

          Products: {
            type: "array",
            items: {
              type: "string",
            },
          },

          cart: {
            type: "object",
            properties: {
              products: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              coupon: {
                type: "string",
                nullable: true,
              },
            },
          },

          createdAt: {
            type: "string",
            format: "date-time",
          },

          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },

      // =====================================
      // SESSION
      // =====================================

      Session: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "65f123456789abcdef123456",
          },

          userAgent: {
            type: "string",
            nullable: true,
            example:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },

          ipAddress: {
            type: "string",
            nullable: true,
            example: "127.0.0.1",
          },

          expiresAt: {
            type: "string",
            format: "date-time",
          },

          createdAt: {
            type: "string",
            format: "date-time",
          },

          updatedAt: {
            type: "string",
            format: "date-time",
          },

          isCurrent: {
            type: "boolean",
            example: true,
          },
        },
      },

      // =====================================
      // RESPONSES
      // =====================================

      MessageResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Operation successful",
          },
        },
      },

      SendOtpResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "OTP sent successfully",
          },

          userId: {
            type: "string",
            example: "65f123456789abcdef123456",
          },

          otp: {
            type: "string",
            example: "123456",
            description:
              "Demo only. OTP should normally be sent through an SMS provider.",
          },
        },
      },

      VerifyOtpResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example:
              "شماره موبایل با موفقیت تایید شد",
          },

          userId: {
            type: "string",
            example: "65f123456789abcdef123456",
          },

          isVerifiedPhoneNumber: {
            type: "boolean",
            example: true,
          },

          isActive: {
            type: "boolean",
            example: false,
          },
        },
      },

      CheckProfileResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example:
              "پروفایل با موفقیت تکمیل شد",
          },

          userId: {
            type: "string",
            example: "65f123456789abcdef123456",
          },

          name: {
            type: "string",
            example: "Ali Ahmadi",
          },

          email: {
            type: "string",
            example: "ali@example.com",
          },

          isVerifiedPhoneNumber: {
            type: "boolean",
            example: true,
          },

          isActive: {
            type: "boolean",
            example: true,
          },
        },
      },

      MeResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example:
              "User authenticated successfully",
          },

          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },

      SessionsResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example:
              "Sessions retrieved successfully",
          },

          sessions: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Session",
            },
          },
        },
      },

      LogoutAllResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example:
              "Logged out from all devices successfully",
          },

          deletedSessions: {
            type: "integer",
            example: 3,
          },
        },
      },

      UsersResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example:
              "Users retrieved successfully",
          },

          users: {
            type: "array",
            items: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;