using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class Manager : MonoBehaviour
{
    [Header("Ball")]
    public GameObject ball;

    [Header("Score UI")]
    public GameObject playerText;

    private int playerScore;

    public void PlayerScored()
    {
        playerScore++;
        playerText.GetComponent<TextMeshProUGUI>().text = playerScore.ToString();
        ball.GetComponent<Ball>().increaseSpeed();
    }

    public void Reset()
    {
        playerScore = 0;
        playerText.GetComponent<TextMeshProUGUI>().text = playerScore.ToString();
    }
}
