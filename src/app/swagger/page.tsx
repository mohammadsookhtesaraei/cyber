"use client";

import "swagger-ui-react/swagger-ui.css";

import SwaggerUI from "swagger-ui-react";

import swaggerDocument from "@/lib/swagger";

export default function SwaggerPage() {
  return (
    <div dir="ltr">
        <SwaggerUI spec={swaggerDocument} />
    </div>
  );
}