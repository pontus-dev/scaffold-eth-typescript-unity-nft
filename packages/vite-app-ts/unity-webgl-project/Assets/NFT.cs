using System.Collections.Generic;
[System.Serializable]
public class NFT {
  public string id;
  public string uri;
  public string base64Data;
  public string owner;
  public string description;
  public string external_url;
  public string image;
  public string name;
  public Attribute[] attributes;
}