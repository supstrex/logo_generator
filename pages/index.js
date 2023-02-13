import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [productNameInput, setProductNameInput] = useState("");
  const [productIndustryInput, setProductIndustryInput] = useState("");
  const [productDescriptionInput, setProductDescriptionInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            productNameInput,
            productIndustryInput,
            productDescriptionInput,
          },
        }),
      });

      const result = await response.json();
      if (response.status !== 200) {
        throw (
          result.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(result);
      setProductNameInput("")
      setProductIndustryInput("")
      setProductDescriptionInput("")
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
        <h3>Generate my Logo</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="productName"
            placeholder="Enter your Company/Product name"
            value={productNameInput}
            onChange={(e) => setProductNameInput(e.target.value)}
            required={true}
          />
          <input
            type="text"
            name="productIndustry"
            placeholder="Enter Company/Product industry"
            value={productIndustryInput}
            onChange={(e) => setProductIndustryInput(e.target.value)}
            required={true}
          />
          <input
            type="text"
            name="productDescription"
            placeholder="Describe your Company/Product"
            value={productDescriptionInput}
            onChange={(e) => setProductDescriptionInput(e.target.value)}
            required={true}
          />
          <input type="submit" value="Generate Logo" />
        </form>
        <div className={styles.result}>
          {result?.image_url ? <img src={result.image_url} /> : <></>}
        </div>
      </main>
    </div>
  );
}
