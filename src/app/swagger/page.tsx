'use client';

import SwaggerUI from 'swagger-ui-react';

import swaggerDocument from '@/lib/swagger';

import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerPage() {
  return (
    <div dir="ltr">
      <SwaggerUI spec={swaggerDocument} />
    </div>
  );
}
