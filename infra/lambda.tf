resource "aws_lambda_function" "cloudquest" {

  function_name = "${var.project_name}-api"

  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  
  role = aws_iam_role.lambda_role.arn

  handler = "handler.lambda_handler"

  runtime = "python3.11"

  timeout = 10

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.quest_requests.name
    }
  }
}