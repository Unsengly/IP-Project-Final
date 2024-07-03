import styles from "./styles.module.css";

const ProductCart = ({ Id, ProductName, Description, Price, Stock, Image, onClickAddCart }) => {
  return (
    <div className={styles.container}>
      <img src={Image} width={100} height={100} alt="" />
      <div className={styles.productName}>{ProductName}</div>
      <div>{Description}</div>
      <div>{Price}$</div>
      <div>Final. {Stock}PCS</div>
      <button onClick={() => onClickAddCart(Id)}>Add To Cart</button>
    </div>
  );
};

export default ProductCart;
