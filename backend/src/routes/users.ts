@@ .. @@
 import { Hono } from 'hono';
 import { eq, and } from 'drizzle-orm';
-import { createDb, users } from '../db';
-import { requireAuth } from '../lib/auth';
+import { createDb, users } from '../db/index';
+import { requireAuth } from '../lib/auth';
 import { createUserSchema, pinValidationSchema } from '../lib/validation';
 
-const app = new Hono<{ 
-  Bindings: CloudflareBindings;
+type Bindings = {
+  NEON_DATABASE_URL: string;
+  CLERK_SECRET_KEY: string;
+};
+
+const app = new Hono<{
+  Bindings: Bindings;
   Variables: {}; 
 }>();
 
@@ .. @@
 
 // Validate PIN
 app.post('/validate-pin', async (c) => {
   const body = await c.req.json();
   const { userId, pin } = pinValidationSchema.parse(body);
 
   const db = createDb(c.env.NEON_DATABASE_URL);
   
@@ .. @@
 
 export default app;