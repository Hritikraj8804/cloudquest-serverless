import json
import uuid
import logging
import os
from datetime import datetime

import boto3

# Logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# DynamoDB
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

# Required fields
REQUIRED_FIELDS = [
    "heroName",
    "heroClass",
    "questType",
    "dangerLevel",
    "description"
]


def generate_quest_id():
    return f"QST-{str(uuid.uuid4())[:8].upper()}"


def calculate_reward(danger_level):
    rewards = {
        "Low": 50,
        "Medium": 150,
        "High": 300,
        "Extreme": 500
    }

    return rewards.get(danger_level, 0)


def calculate_rank(danger_level):
    ranks = {
        "Low": "Novice",
        "Medium": "Adventurer",
        "High": "Elite",
        "Extreme": "Legendary"
    }

    return ranks.get(danger_level, "Unknown")


def validate_request(data):
    missing_fields = []

    for field in REQUIRED_FIELDS:
        if not data.get(field):
            missing_fields.append(field)

    return missing_fields


def save_quest(item):
    table.put_item(Item=item)


def lambda_handler(event, context):

    logger.info("CloudQuest request received")

    try:
        body = json.loads(event["body"])

    except Exception:
        logger.exception("Invalid request body")

        return {
            "statusCode": 400,
            "body": json.dumps({
                "error": "Invalid JSON payload"
            })
        }

    missing_fields = validate_request(body)

    if missing_fields:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "error": "Missing required fields",
                "fields": missing_fields
            })
        }

    danger_level = body["dangerLevel"]

    quest_id = generate_quest_id()

    reward = calculate_reward(danger_level)

    guild_rank = calculate_rank(danger_level)

    quest = {
        "questId": quest_id,
        "heroName": body["heroName"],
        "heroClass": body["heroClass"],
        "questType": body["questType"],
        "dangerLevel": danger_level,
        "description": body["description"],
        "reward": reward,
        "guildRank": guild_rank,
        "createdAt": datetime.utcnow().isoformat()
    }

    try:
        save_quest(quest)

        logger.info(
            f"Quest {quest_id} successfully saved to DynamoDB"
        )

    except Exception:
        logger.exception("Failed to save quest")

        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": "Failed to save quest"
            })
        }

    return {
        "statusCode": 200,
        "body": json.dumps({
            "questId": quest_id,
            "reward": reward,
            "guildRank": guild_rank,
            "message": "Quest accepted by the guild"
        })
    }