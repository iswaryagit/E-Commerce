import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone-uploader';
import { createWorker } from "tesseract.js";
import Link from "next/link";

const Uploadsearch = () => {
    const [products,setProducts] = useState([]);
    const [text, setText] = useState(null);
    const [imageUrl] = useState(null);

    useEffect(() => {
        if (imageUrl != null) {
            ExtractTextFromImage();
        }
    });

      useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("myproducts")));
  }, []);

    const worker = createWorker({
        logger: (m) => console.log(m),
    });

    const ExtractTextFromImage = async (imageUrl) => {
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
            data: {
                text
            },

        } = await worker.recognize(imageUrl);
        setText(text);
        await worker.terminate();
    };


    const getUploadParams = () => {
        return {
            url: 'https://httpbin.org/post'
        }
    }

    const handleChangeStatus = ({
        meta
    }, status) => {
        if (status === 'headers_received') {
            alert("Uploaded");
            setText("Recognizing...");
            ExtractTextFromImage(meta.previewUrl);
        } else if (status === 'aborted') {
            alert("Something went wrong")
        }
    }

    const store = (text) => {
        const splittext = text.replace( /\n/g, " " ).replace(/[^a-zA-Z ]/g, "").split(/(\s+)/).filter(function(str) {
            return /\S/.test(str);   
        })
        localStorage.setItem("scanitem", JSON.stringify(splittext));
        const search = products.map(item => {
            const searchitem = [];

            for (let i = 0; i < splittext.length; i++) {
                if (item.title.toLowerCase().includes(splittext[i].toLowerCase()))
                {
                    searchitem.push(item);
                }
            }
            return searchitem;
        });
        console.log(search);
        localStorage.setItem("scanfiltered", JSON.stringify(search));
    }

    return (
        <>
        <div style={{paddingTop: '50px'}}></div>
        <Dropzone getUploadParams = {getUploadParams}
        onChangeStatus = {handleChangeStatus}
        maxFiles = {1}
        multiple = {false}
        canCancel = {false}
        accept = "image/jpeg, image/png, image/jpg"
        inputContent = {
            (files,extra) => (extra.reject ? 'Only PNG and JPG Image files are allowed' : 'Drop  image here ')
        }
        styles = {
            {
                dropzoneActive: {
                    borderColor: 'green'
                },
                dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
                    inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
            }
        }
        />
        <div className = "container pt-5" > {
            text
        } </div>
        {text &&   
        <Link className = "center p-10" href="/searchresults">
          <a className="btn btn-secondary my-3" onClick={store(text)}>
            Click here to view searched products
          </a>
        </Link>}
        </>
    )
};

export default Uploadsearch;