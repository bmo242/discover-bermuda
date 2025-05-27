#!/bin/bash

# Find all TypeScript files in the api directory and update the prisma import
find src/app/api -name "*.ts" -type f -exec sed -i '' 's/import prisma from "@\/lib\/prisma"/import { prisma } from "@\/lib\/prisma"/' {} + 