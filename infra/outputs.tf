output "dynamodb_table_name" {
  value = aws_dynamodb_table.quest_requests.name
}

output "dynamodb_table_arn" {
  value = aws_dynamodb_table.quest_requests.arn
}