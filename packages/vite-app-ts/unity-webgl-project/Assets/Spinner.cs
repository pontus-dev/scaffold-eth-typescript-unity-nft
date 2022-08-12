using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Spinner : MonoBehaviour
{
    public float speed = 0.5f;
    // Start is called before the first frame update
    public AnimationCurve curve;
    private float elapsedTime;

    void Start()
    {
        elapsedTime = 0;
    }

    // Update is called once per frame
    void Update()
    {
        elapsedTime += Time.deltaTime * speed;
        var animatedY = curve.Evaluate(elapsedTime);
        transform.position =
            new Vector3(
                transform.position.x,
                animatedY,
                transform.position.z
            );
        transform.rotation =
          Quaternion.Euler(
            0,
            -45 + (curve.Evaluate(elapsedTime) * 90),
            0
          );
        if (elapsedTime >= 1) elapsedTime = 0;
    }
}
