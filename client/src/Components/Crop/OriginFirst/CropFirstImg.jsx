import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import React, { useContext, useRef, useEffect } from 'react'
import { FileContext } from '../../contexts/fileContext'
import axios from '../../../Global/API/axios'
import './CropFirstImg.css'
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaCrop } from 'react-icons/fa';
import { BsFillCloudUploadFill } from 'react-icons/bs';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


const CropFirstImg = () => {
    const inputFile = useRef(null);
    const {
        firstCrop,
        setFirstCrop,
        firstFile,
        setFirstFile,
        checkMode,
        setCheckMode,
        magnitudeSecondURL,
        magnitudeFirstURL,
        setMagnitudeFirstURL,
        phaseFirstURL,
        setphaseFirstURL,
        originalFirstURL,
        setOriginalFirstURL,
        setOriginalFirstImgId,
        originalFirstImgId,
        originalSecondImgId,
        secondCrop,
        magFirstCrop,
        phaseFirstCrop,
        magSecondCrop,
        phaseSecondCrop,
        checkModeBinary,
        setCheckModeBinary,
        checkMerge,
        setCheckMerge,
        resultURL,
        setResultURL,
        firstFileBinary,
        setFirstFileBinary,
        secondFileBinary,
        setSecondFileBinary,
        secondFile,
        originalSecondURL,
        passMode,
        setPassMode,
        setSecondCrop,
        setMagFirstCrop,
        setPhaseFirstCrop,
        setMagSecondCrop,
        setPhaseSecondCrop,
        passModeBinary,
    setPassModeBinary
        } = useContext(FileContext);

    const reset = {
            unit: '%', // Can be 'px' or '%'
            x: 0,
            y: 0,
            width: 0,
            height: 0
    }

    useEffect(() => {
        if (checkMode === false) {
            setCheckModeBinary(0)
        } else {
            setCheckModeBinary(1)
        }
    }, [checkMode])


    useEffect(() => {
        if (firstFile !== undefined) {
            setFirstFileBinary(1)
        } else {
            setFirstFileBinary(0)
        }
    }, [firstFile])


    useEffect(() => {
        if (originalFirstURL === undefined && originalSecondURL === undefined) {
            setResultURL(undefined)
        }
    }, [originalFirstURL,originalSecondURL])

    useEffect(() => {
        if (magnitudeFirstURL !== undefined && magnitudeSecondURL !== undefined) {
            axios.post('/select',
            {
                "fid": originalFirstImgId,
                "firstCrop": firstCrop,
                "sid": originalSecondImgId,
                "secondCrop": secondCrop,
                "magFirstCrop": magFirstCrop,
                "phaseFirstCrop": phaseFirstCrop,
                "magSecondCrop": magSecondCrop,
                "phaseSecondCrop": phaseSecondCrop,
                "mode": checkModeBinary,
                "flag": checkMerge,
                "filter": passModeBinary
              }
            ).then((response) => {
                console.log(response)
                setResultURL(response.data.result_url)
            }).catch((err) => {
                console.log(err)
            })
        
        }
    }, [magnitudeFirstURL,magnitudeSecondURL])

    useEffect(() => {
        if (originalFirstURL === undefined && originalSecondURL !== undefined) {
            axios.get(`/gray?imgId=${originalSecondImgId}`)
            .then((res) => {
                console.log(res);
                setResultURL(res.data.gray_url)
            })
            .catch((err)=> {
                console.log(err);
            })
        }
    }, [originalFirstURL])

    useEffect(() => {
        if (magnitudeFirstURL !== undefined && magnitudeSecondURL === undefined) {
            axios.get(`/gray?imgId=${originalFirstImgId}`)
            .then((res) => {
                console.log(res);
                setResultURL(res.data.gray_url)
            })
            .catch((err)=> {
                console.log(err);
            })
        }
    }, [magnitudeFirstURL])


    const handleFileFirstUpload = (e) => {
        setFirstFile(URL.createObjectURL(e.target.files[0]));
        const formData = new FormData();
        formData.append("Img", e.target.files[0])
        formData.append("f_file", firstFileBinary)
        formData.append("s_file", secondFileBinary)
        axios.post('/img',
            formData
        ).then((response) => {
            setOriginalFirstURL(response.data.img_url)
            setOriginalFirstImgId(response.data.imgId)
            axios.get(`/combImg?imgId=${response.data.imgId}`
            ).then((response) => {
                setMagnitudeFirstURL(response.data.mag_img_url)
                setphaseFirstURL(response.data.phase_img_url)
                console.log(response)        
            }).catch((err) => {
                console.log(err)
            })
            console.log(response)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleButtonClick = () => {
        inputFile.current.click();
    };

    const handleImgDelete = () => {
        setOriginalFirstURL(undefined)
        setMagnitudeFirstURL(undefined)
        setphaseFirstURL(undefined)
        setOriginalFirstImgId(null)
        setFirstFile(undefined)
        setFirstCrop(reset)
        setSecondCrop(reset)
        setMagFirstCrop(reset)
        setPhaseFirstCrop(reset)
        setMagSecondCrop(reset)
        setPhaseSecondCrop(reset)
        inputFile.current.value = null
    }

    const handleSelectClick = () => {
        setCheckMode(!checkMode)
    }
    console.log(passMode);


    return (
        <div className='first-image-container'>
            <div className="first-image">

                <div className='buttons'>
                    <div className='upload-delete'>
                        <button onClick={handleButtonClick}>
                            <BsFillCloudUploadFill />
                        </button>
                        {/* <button onClick={handleImgDelete}>
                            <AiTwotoneDelete />
                        </button> */}
                    </div>
                    <div className='switch'>
                        <BootstrapSwitchButton
                            className = "custom-btn"
                            checked={checkMode}
                            onlabel='Orignal'
                            onstyle='primary'
                            offlabel='Phase/Magnitude'
                            offstyle='danger'
                            style='w-1000 mx-2'
                            onChange={(e) => {
                                setCheckMode(!checkMode)
                                e.preventDefault()
                            }}
                        />
                    </div>
                    <input
                        type='file'
                        id='file'
                        ref={inputFile}
                        style={{ display: 'none' }}
                        onChange={handleFileFirstUpload}
                    />
                </div>
                <div className='image'>
                    {checkMode === true ? (
                        <ReactCrop style={{
                            boxShadow : passMode === false ? null : "0 0 0 9999em rgb(0 0 0 / 0%) !important" , 
                            backgroundColor:passMode === false ? "rgb(0 0 0 / 0%)" : "rgb(0 0 0 / 50%) !important"
                        }} 
                        crop={firstCrop} onChange={(c, per) => setFirstCrop(per)}
                            onComplete={(px, percent) => {
                                axios.post('/select',
                                {
                                    "fid": originalFirstImgId,
                                    "firstCrop": firstCrop,
                                    "sid": originalSecondImgId,
                                    "secondCrop": secondCrop,
                                    "magFirstCrop": magFirstCrop,
                                    "phaseFirstCrop": phaseFirstCrop,
                                    "magSecondCrop": magSecondCrop,
                                    "phaseSecondCrop": phaseSecondCrop,
                                    "mode": checkModeBinary,
                                    "flag": checkMerge,
                                    "filter": passModeBinary
                                  }
                                ).then((response) => {
                                    //console.log(response)
                                    setResultURL(response.data.result_url)
                                }).catch((err) => {
                                    //console.log(err)
                                })
                            }}>
                            <img style={{ width: originalFirstURL !== null ? "auto" : "auto", height: originalFirstURL !== null ? "40vh" : "auto", marginTop: "auto", marginBottom: "auto" }} src={originalFirstURL} />
                        </ReactCrop>
                    ) :
                        <img style={{ width: firstFile !== undefined ? "auto" : "auto", height: firstFile !== undefined ? "40vh" : "auto", marginTop: "auto", marginBottom: "auto" }} src={originalFirstURL} />
                    }
                </div>

            </div>
        </div>
    )
}

export default CropFirstImg


