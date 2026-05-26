data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "../lambda/handler.py"
  output_path = "../lambda/function.zip"
}