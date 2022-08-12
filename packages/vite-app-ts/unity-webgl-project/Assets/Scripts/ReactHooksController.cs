using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.Events;

public class ReactHooksController : MonoBehaviour {
  //INCOMING
  //Subscribe to this for incoming messages from react
  public UnityEvent<string> CollectiblesSetEvent = new UnityEvent<string> ();

  //Incoming messages, gets called by react
  public void SetCollectibles (string json) => CollectiblesSetEvent.Invoke (json);


  //OUTGOING
  [DllImport ("__Internal")]
  public static extern void SetListenerState (string state);
}