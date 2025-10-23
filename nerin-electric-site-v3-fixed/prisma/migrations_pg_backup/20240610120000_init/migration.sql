-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'tecnico', 'cliente');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('vivienda', 'comercio', 'oficina', 'edificio');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('planificado', 'en_progreso', 'detenido', 'finalizado');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('pendiente', 'pagado');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('abierto', 'en_progreso', 'resuelto', 'cerrado');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('pendiente', 'emitida', 'pagada');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'cliente',
    "empresa" TEXT,
    "cuit" TEXT,
    "telefono" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "direccion" TEXT,
    "ciudad" TEXT,
    "notas" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "ProjectType" NOT NULL,
    "estado" "ProjectStatus" NOT NULL DEFAULT 'planificado',
    "direccion" TEXT NOT NULL,
    "metros2" INTEGER,
    "normativasAplicadas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fechaInicio" TIMESTAMP(3),
    "fechaFinEstimada" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pack" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "soloManoObra" BOOLEAN NOT NULL DEFAULT true,
    "alcanceDetallado" TEXT[],
    "bocasIncluidas" INTEGER NOT NULL,
    "ambientesReferencia" INTEGER NOT NULL,
    "precioManoObraBase" DECIMAL(12,2) NOT NULL,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalItem" (
    "id" TEXT NOT NULL,
    "packId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "precioUnitarioManoObra" DECIMAL(12,2) NOT NULL,
    "reglasCompatibilidad" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguratorQuote" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "packId" TEXT NOT NULL,
    "itemsSeleccionados" JSONB NOT NULL,
    "totalManoObra" DECIMAL(12,2) NOT NULL,
    "proyectoElectricoAparte" DECIMAL(12,2) NOT NULL DEFAULT 500000,
    "materialesIncluidos" BOOLEAN NOT NULL DEFAULT false,
    "aclaracionesMateriales" TEXT DEFAULT 'Materiales se cotizan aparte según marcas.',
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientViewToken" TEXT,

    CONSTRAINT "ConfiguratorQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguratorQuoteItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "additionalItemId" TEXT,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ConfiguratorQuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenancePlan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "incluyeTareasFijas" TEXT[],
    "visitasMes" INTEGER NOT NULL,
    "precioMensual" DECIMAL(12,2) NOT NULL,
    "cantidadesFijasInalterables" BOOLEAN NOT NULL DEFAULT true,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenancePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceSubscription" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mpPreferenceId" TEXT,
    "mpInitPointUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "visitas" INTEGER NOT NULL,
    "checklist" TEXT[],
    "fotos" TEXT[],
    "firmadoPorCliente" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressCertificate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "porcentaje" INTEGER NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "estado" "ProgressStatus" NOT NULL DEFAULT 'pendiente',
    "mpPreferenceId" TEXT,
    "mpInitPointUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "estado" "InvoiceStatus" NOT NULL DEFAULT 'pendiente',
    "urlPdf" TEXT,
    "fecha" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fotos" TEXT[],
    "metricas" JSONB,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credenciales" TEXT[],
    "fotoUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "asunto" TEXT NOT NULL,
    "estado" "TicketStatus" NOT NULL DEFAULT 'abierto',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL DEFAULT '5491100000000',
    "whatsappMessage" TEXT NOT NULL DEFAULT 'Hola, soy [Nombre]. Quiero cotizar un servicio eléctrico con NERIN.',
    "direccionOficina" TEXT NOT NULL DEFAULT 'CABA, Argentina',
    "emailContacto" TEXT NOT NULL DEFAULT 'hola@nerin.com.ar',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pack_slug_key" ON "Pack"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguratorQuote_clientViewToken_key" ON "ConfiguratorQuote"("clientViewToken");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenancePlan_slug_key" ON "MaintenancePlan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_nombre_key" ON "Brand"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Technician_userId_key" ON "Technician"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalItem" ADD CONSTRAINT "AdditionalItem_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguratorQuote" ADD CONSTRAINT "ConfiguratorQuote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguratorQuote" ADD CONSTRAINT "ConfiguratorQuote_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguratorQuoteItem" ADD CONSTRAINT "ConfiguratorQuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "ConfiguratorQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguratorQuoteItem" ADD CONSTRAINT "ConfiguratorQuoteItem_additionalItemId_fkey" FOREIGN KEY ("additionalItemId") REFERENCES "AdditionalItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSubscription" ADD CONSTRAINT "MaintenanceSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MaintenancePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSubscription" ADD CONSTRAINT "MaintenanceSubscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCertificate" ADD CONSTRAINT "ProgressCertificate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technician" ADD CONSTRAINT "Technician_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

