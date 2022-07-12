using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Listener : MonoBehaviour {
  public ReactHooksController reactHooksController;
  public Text text;
  // Start is called before the first frame update
  void Start () {
    reactHooksController.CollectiblesSetEvent.AddListener (LogMessage);
  }

  void LogMessage (string json) {
    Debug.Log ("Got the collectibles");
    text.text = json;
  }
}
