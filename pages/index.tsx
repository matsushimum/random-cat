import {GetServerSideProps,NextPage} from "next";
import {useEffect,useState} from "react";
import styles from "./index.module.css";

type Props = {
    initialImageUrl:string;
}

const IndexPage: NextPage<Props> = ({initialImageUrl}) =>{
    const [imageUrl,setImageUrl] = useState(initialImageUrl);//初期値を渡す
    const [loading,setLoading] = useState(true);//初期状態はfalse

    useEffect(()=>{
        fetchImage().then((newImage)=>{
            setImageUrl(newImage.url);
            setLoading(false);
        });
    },[]);

    //ローディング中でなければ画像表示
    const handleClick = async () => {
        setLoading(true);//読み込み中フラグを立てる
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);//読み込み中フラグを倒す
    };
    return(
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>
                他のにゃんこも見る
                </button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} />}
            </div>
        </div>
    );
};

export default IndexPage;

//サーバーサイドで実行する処理
export const getServerSideProps:GetServerSideProps<Props> = async () =>{
    const image = await fetchImage();
    return{
        props:{
            initialImageUrl:image.url,
        },
    };
};

type Image = {
    url:string;
};

const fetchImage = async ():Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
};