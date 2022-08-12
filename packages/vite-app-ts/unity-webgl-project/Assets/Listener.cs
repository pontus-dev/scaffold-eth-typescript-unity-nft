using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class Listener : MonoBehaviour
{
    public ReactHooksController reactHooksController;
    public Text text;
    public NFTDisplay nftDisplay;
    public List<NFTDisplay> nftDisplays;
    private NFTDisplay currentNFTDisplay;
    private bool canNext;

    void Start()
    {
        reactHooksController.CollectiblesSetEvent.AddListener(LogMessage);
        ReactHooksController.SetListenerState("Initialized");
        canNext = true;
    }

    void LogMessage(string json)
    {
        Debug.Log("Got the collectibles");
        Debug.Log(json);
        NFTData nfts = JsonUtility.FromJson<NFTData>(json);
        text.text = $"You have {nfts.datas.Length} NFTs";
        var i = 0;
        foreach (var nft in nfts.datas)
        {
            byte[] imageBytes = System.Convert.FromBase64String(nft.base64Data.Replace("data:image/jpeg;base64,", ""));
            Texture2D tex = new Texture2D(2, 2);
            tex.LoadImage(imageBytes);
            var display = Instantiate(nftDisplay, Vector3.zero, Quaternion.identity);
            nftDisplays.Add(display);
            display.spriteRenderer.sprite = Sprite.Create(tex, new Rect(0.0f, 0.0f, tex.width, tex.height), new Vector2(0.5f, 0.5f), 100.0f);
            display.gameObject.SetActive(false);
        }
        currentNFTDisplay = nftDisplays[0];
        currentNFTDisplay.gameObject.SetActive(true);
    }

    void Update()
    {
        if (canNext && Input.GetKeyDown(KeyCode.Space))
        {
            canNext = false;
            StartCoroutine(NextNFT());
        }
    }

    private IEnumerator NextNFT()
    {
        var elapsedTime = 0f;
        var time = 1f;
        currentNFTDisplay.update = false;
        while (elapsedTime < time)
        {
            elapsedTime += Time.deltaTime;
            currentNFTDisplay.transform.position = Vector3.Lerp(Vector3.zero, Vector3.left * 10, elapsedTime / time);
            yield return null;
        }
        var index = nftDisplays.IndexOf(currentNFTDisplay);
        if (index >= nftDisplays.Count - 1) index = 0; else index++;
        currentNFTDisplay.gameObject.SetActive(false);
        currentNFTDisplay = nftDisplays[index];
        StartCoroutine(SlideIn());
    }

    private IEnumerator SlideIn()
    {
        var elapsedTime = 0f;
        var time = 1f;
        currentNFTDisplay.update = false;
        currentNFTDisplay.transform.position = Vector3.right * 10;
        currentNFTDisplay.gameObject.SetActive(true);
        while (elapsedTime < time)
        {
            elapsedTime += Time.deltaTime;
            currentNFTDisplay.transform.position = Vector3.Lerp(Vector3.right * 10, Vector3.zero, elapsedTime / time);
            yield return null;
        }
        currentNFTDisplay.update = true;
        canNext = true;
    }
}
