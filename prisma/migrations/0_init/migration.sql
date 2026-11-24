-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "carritos" (
    "id_carrito" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6),
    "estado" VARCHAR(30),

    CONSTRAINT "carritos_pkey" PRIMARY KEY ("id_carrito")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(255),
    "estado" BOOLEAN,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "apellido" VARCHAR(100),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(150),
    "direccion" VARCHAR(255),
    "fecha_registro" TIMESTAMP(6),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "detalle_carrito" (
    "id_detalle_carrito" SERIAL NOT NULL,
    "id_carrito" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER,

    CONSTRAINT "detalle_carrito_pkey" PRIMARY KEY ("id_detalle_carrito")
);

-- CreateTable
CREATE TABLE "detalle_metodo_pago" (
    "id_detalle_pago" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_metodo_pago" INTEGER NOT NULL,
    "monto" DECIMAL(10,2),
    "referencia" VARCHAR(150),
    "fecha_pago" TIMESTAMP(6),
    "estado" VARCHAR(30),

    CONSTRAINT "detalle_metodo_pago_pkey" PRIMARY KEY ("id_detalle_pago")
);

-- CreateTable
CREATE TABLE "detalle_ventas" (
    "id_detalle_venta" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER,
    "precio_unitario" DECIMAL(10,2),
    "subtotal" DECIMAL(10,2),

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id_detalle_venta")
);

-- CreateTable
CREATE TABLE "metodos_pago" (
    "id_metodo_pago" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "descripcion" VARCHAR(255),
    "estado" BOOLEAN,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id_metodo_pago")
);

-- CreateTable
CREATE TABLE "productos" (
    "id_producto" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "nombre" VARCHAR(150),
    "descripcion" TEXT,
    "precio" DECIMAL(10,2),
    "stock" INTEGER,
    "imagen" VARCHAR(255),
    "estado" BOOLEAN,
    "fecha_registro" TIMESTAMP(6),

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "usuario" VARCHAR(50),
    "password" VARCHAR(255),
    "rol" VARCHAR(30),
    "estado" BOOLEAN,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id_venta" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "fecha_venta" TIMESTAMP(6),
    "total" DECIMAL(10,2),
    "estado" VARCHAR(30),
    "direccion_entrega" VARCHAR(255),

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id_venta")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_correo_key" ON "clientes"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_id_cliente_key" ON "usuarios"("id_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_carrito" ADD CONSTRAINT "detalle_carrito_id_carrito_fkey" FOREIGN KEY ("id_carrito") REFERENCES "carritos"("id_carrito") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_carrito" ADD CONSTRAINT "detalle_carrito_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_metodo_pago" ADD CONSTRAINT "detalle_metodo_pago_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "metodos_pago"("id_metodo_pago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_metodo_pago" ADD CONSTRAINT "detalle_metodo_pago_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;
