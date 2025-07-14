# Stage 1: Build aplikasi
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Build aplikasi untuk production
# Flag --no-cache diperlukan agar output standalone selalu dibuat ulang
RUN npm run build --no-cache

# ----------------------------------------------------------------

# Stage 2: Jalankan aplikasi dalam environment production yang sangat ringan
FROM node:18-alpine AS runner

WORKDIR /app

# Buat user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin hasil build standalone dari stage 'builder'
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Ganti ke user non-root
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variable untuk port
ENV PORT 3000

# Perintah untuk menjalankan server Node.js dari output standalone
CMD ["node", "server.js"]