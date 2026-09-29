import { NextResponse } from "next/server";

import {
  AccessTokenPayload,
  verifyAccessToken,
} from "@/utils/auth";

export type UserRole = "USER" | "ADMIN";

export function authorizeRole(
  accessToken: string | undefined,
  allowedRoles: UserRole[]
):
  | { authorized: true; payload: AccessTokenPayload }
  | { authorized: false; response: NextResponse } {
  // Check access token
  if (!accessToken) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          message: "Access token is required",
        },
        {
          status: 401,
        }
      ),
    };
  }

  // Verify access token
  const payload =
    verifyAccessToken(accessToken);

  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          message:
            "Access token is invalid or expired",
        },
        {
          status: 401,
        }
      ),
    };
  }

  // Check role
  if (!allowedRoles.includes(payload.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          message: "Access denied",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    authorized: true,
    payload,
  };
}