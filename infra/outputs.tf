output "dynamodb_table_name" {
  value = aws_dynamodb_table.quest_requests.name
}

output "dynamodb_table_arn" {
  value = aws_dynamodb_table.quest_requests.arn
}

output "lambda_name" {
  value = aws_lambda_function.cloudquest.function_name
}

output "lambda_arn" {
  value = aws_lambda_function.cloudquest.arn
}