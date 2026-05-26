resource "aws_dynamodb_table" "quest_requests" {
  name         = "${var.project_name}-quest-requests"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "questId"

  attribute {
    name = "questId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }
}