resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${random_id.bucket_suffix.hex}"
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_website_configuration" "frontend" {

  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {

  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend" {

  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = "*"

        Action = [
          "s3:GetObject"
        ]

        Resource = [
          "${aws_s3_bucket.frontend.arn}/*"
        ]
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.frontend
  ]
}

resource "aws_s3_object" "index" {

  bucket = aws_s3_bucket.frontend.id

  key = "index.html"

  source = "../frontend/index.html"

  content_type = "text/html"
}

resource "aws_s3_object" "css" {

  bucket = aws_s3_bucket.frontend.id

  key = "style.css"

  source = "../frontend/style.css"

  content_type = "text/css"
}

resource "aws_s3_object" "js" {

  bucket = aws_s3_bucket.frontend.id

  key = "app.js"

  source = "../frontend/app.js"

  content_type = "application/javascript"
}