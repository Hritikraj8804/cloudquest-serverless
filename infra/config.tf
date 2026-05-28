resource "local_file" "frontend_config" {

  filename = "../frontend/config.js"

  content = templatefile(
    "../frontend/config.js.tpl",
    {
      api_url = "${aws_apigatewayv2_api.cloudquest.api_endpoint}/quests"
    }
  )
}