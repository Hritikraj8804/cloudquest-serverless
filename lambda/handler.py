import json
import uuid
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


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


def lambda_handler(event, context):

    logger.info("CloudQuest request received")

    body = json.loads(event["body"])

    danger_level = body["dangerLevel"]

    quest_id = generate_quest_id()

    reward = calculate_reward(danger_level)

    rank = calculate_rank(danger_level)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "questId": quest_id,
            "reward": reward,
            "guildRank": rank,
            "message": "Quest accepted by the guild"
        })
    }