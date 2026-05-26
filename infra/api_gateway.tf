resource "aws_apigatewayv2_api" "cloudquest" {

  name = "${var.project_name}-api"

  protocol_type = "HTTP"

  cors_configuration {

    allow_origins = ["*"]

    allow_methods = ["POST"]

    allow_headers = ["content-type"]
  }
}

resource "aws_apigatewayv2_integration" "lambda" {

  api_id = aws_apigatewayv2_api.cloudquest.id

  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.cloudquest.invoke_arn
}

resource "aws_apigatewayv2_route" "submit_quest" {

  api_id = aws_apigatewayv2_api.cloudquest.id

  route_key = "POST /quests"

  target = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "dev" {

  api_id = aws_apigatewayv2_api.cloudquest.id

  name = "$default"

  auto_deploy = true
}

resource "aws_lambda_permission" "api_gateway" {

  statement_id = "AllowExecutionFromAPIGateway"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.cloudquest.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.cloudquest.execution_arn}/*/*"
}