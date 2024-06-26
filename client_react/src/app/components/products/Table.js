import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import useAuth from "../auth/useAuth"
import { useGetAllCountriesQuery } from '../countries/countriesApiSlice';
import { useGetAllCategoriesQuery } from '../categories/categoryapiSlice';
import { VirtualScroller } from 'primereact/virtualscroller';
import { classNames } from 'primereact/utils';
import { Avatar } from 'primereact/avatar';

// import { ProductService } from './service/ProductService';
import {
    useGetAllProductsByChefQuery, useUpdateProductMutation, useDeleteProductMutation
    , useCreateNewProductMutation,
    useGetByChefQuery
} from './productsApiSlice';

import { Button } from 'primereact/button';
import CategoriesList from './CategoriesList';
import CountryList from './CountryList';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
export default function Table() {
    const { _id } = useAuth()


    let emptyProduct = {
        id: null,
        name: '',
    };
    const [productCreate, setProductCreate] = useState({
        name: "",
        category: [],
        country: "",
        chef: _id,
        price: 0

    });
    const [products, setProducts] = useState(null);
    const [cat, setCat] = useState(null);
    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);
    const { data: productsData = [], isLoading, isSuccess: isSuccessGet, isError: isErrorGet, error: errorGet, refetch } = useGetByChefQuery(_id);
    // const { data: productsData = [], isLoading, isSuccess:isSuccessGet, isError:isErrorGet, error:errorGet, refetch } =useGetAllProductsByChefQuery(_id);
    const [createNewProduct, { isError: isErrorCreate, error: errorCreate, isSuccess: isSuccessCreate, data: dataCreate }] = useCreateNewProductMutation()
    const [updateProduct, { isError, error, isSuccess, data }] = useUpdateProductMutation();
    const [deleteFunc] = useDeleteProductMutation();

    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [addProductDialog, setAddProductDialog] = useState(false);
    const { data: categoriesData = [], isLoadingcategories, isSuccessCategories } = useGetAllCategoriesQuery();
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [categories, setCategories] = useState(null);
    const { data: countriesData = [], isSuccessCountries } = useGetAllCountriesQuery();
    const [selectedCountries, setSelectedCountries] = useState(null);
    const [countries, setCountries] = useState(null);
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [product, setProduct] = useState("");


    useEffect(() => {
        const _countriesData = countriesData.map(c => { return { name: c.name, id: c._id } });
        // const   = categoriesData.map(c=>return{name:c.name});
        setCountries(_countriesData)
        console.log(countries);

    }, [isSuccessCountries])



    useEffect(() => {
        const _categoriesData = categoriesData.map(c => { return { name: c.name, id: c._id } });
        setCategories(_categoriesData)

    }, [isSuccessCategories])


    useEffect(() => {
        if (isSuccessGet) {
            setProducts(productsData)
        }


        // ProductService.getProductsMini().then((data) => setProducts(data));
    }, [isSuccessGet]);

    useEffect(() => {

        setProducts(productsData)

        // ProductService.getProductsMini().then((data) => setProducts(data));
    }, [productsData]);

    // eslint-disable-line react-hooks/exhaustive-deps
    // const createNewProduct=(e)=>{
    //     let _products = [...products,e];
    //     // console.log(_products);
    //     // console.log(`newData${newData} index${index}`);
    //     // let { newData, index } = e;
    //     //_products[index] = newData;
    //     // console.log(e.data);
    //     try{
    //     createFunc(e);
    //     setProducts(_products);}
    //     catch{}  
    // }
    // const getSeverity = (value) => {
    //    case
    // };
    const onRowEditComplete = async (e) => {
        // console.log(`onRowEditComplete${e.data.picture}`);
        let _products = [...products];
        //    console.log(`bnmhm${selectedPicture.objectURL+selectedPicture.name}`);
        let { newData, index } = e;
        //    console.log((selectedPicture.objectURL+'/'+selectedPicture).namesplit("\\")[2]); 
        //  newData.picture=(selectedPicture.objectURL+'/'+selectedPicture).namesplit("\\")[2]
        //  console.log(`newData ${newData.picture} `);
        _products[index] = newData;
        // console.log(selectedPicture);
        console.log(e.newData.name);
        console.log(e.newData.picture);
        console.log(selectedPicture);
        const picture = selectedPicture
        var category = cat
        if (cat == null)
            category = e.newData.category.map(e => e._id);
        // if(selectedPicture)
        // picture=e.newData.picture

        const formData = new FormData();
        formData.append("_id", e.newData._id);
        formData.append("picture", selectedPicture);
        formData.append("name", e.newData.name);
        formData.append("category", category);
        // formData.append("country",e.newData.country);
        formData.append("price", e.newData.price);

        try {

            // console.log(formData["id"]);
            updateProduct(formData);

        }
        catch { console.log(error); }

    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };
    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => { console.log(e.target.value); options.editorCallback(e.target.value) }} mode="currency" currency="USD" locale="en-US" />;
    };
    // const priceEditor = (options) => {
    //     return <InputNumber  value={options.value} onChange={(e) => {options.editorCallback(e.target.value)}} mode="currency" currency="USD" locale="en-US" />;
    // };
    // value={options.value}
    // const categoryEditor = (options) => {
    //     return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    // };
    const categoryEditor = (options) => {
        return (
            <CategoriesList setCat={setCat} />
            // <Dropdown
            //     value={options.value}
            //     options={statuses}
            //     onChange={(e) => options.editorCallback(e.value)}
            //     placeholder="Select a Status"
            //     // itemTemplate={(option) => {
            //     //     return <Tag value={option} severity={getSeverity(option)}></Tag>;
            //     // }}
            // />
        );
    };

    const statusEditor = (options) => {
        // setSelectedPicture(options.picture)
        return (
            <div className="card flex justify-content-center">
                <FileUpload name="demo[]" auto accept="image/*" maxFileSize={1000000000000000} emptyTemplate={<p className="m-0">upload picture</p>}
                    uploadLabel='&nbsp;העלאה' cancelLabel='&nbsp;ביטול' chooseLabel='choose &nbsp;'
                                   /**/ customUpload uploadHandler={(e) => setSelectedPicture(e.files[0])}
                />

            </div>
            // <Dropdown
            //     value={options.value}
            //     options={statuses}
            //     onChange={(e) => options.editorCallback(e.value)}
            //     placeholder="picture"
            //     itemTemplate={(option) => {
            //     // <Tag value={option} severity={getSeverity(option)}></Tag>;
            //         return <img src={`http://localhost:7788/${options.value.picture}`}  style={{width:'150px'}}   />
            //     }}
            // />
        );
    };



    const statusBodyTemplate = (rowData) => {
        // console.log(rowData.picture);
        return <img src={`http://localhost:7788/uploads/${rowData.picture.split("\\")[2]}`} style={{ width: '150px' }} />
        // return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)}></Tag>;
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    const allowEdit = (rowData) => {
        // console.log(rowData.name);
        // return rowData.name !== 'Green ';
        return rowData.name !== 'Blue Band';
    };
    const itemTemplateCategory = (item, options) => {
        const className = classNames('flex align-items-center p-2', {
            'surface-hover': options.odd
        });
        return (
            <div className={className} >
                {item.name}
            </div>
        );
    };

    const categoriesArr = (rowData) => {
        console.log(rowData.category);
        const names = rowData.category.map(e => e.name)
        console.log(names);
        return (
            <VirtualScroller items={rowData.category} itemSize={50} itemTemplate={itemTemplateCategory} className="border-1 surface-border border-round" style={{ width: '200px', height: 0, minHeight: '70px' }} />
        )
        // 
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>

                <Button icon="pi pi-trash" rounded text onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const hideAddProductDialog = () => {
        setAddProductDialog(false);
    };
    const addProduct = () => {
        setAddProductDialog(true);
    };
    const confirmDeleteProduct = (product) => {

        console.log(product._id);
        // console.log(product);
        setProduct({ id: product._id, name: product.name });
        console.log(product);
        setDeleteProductDialog(true);
    };
    const deleteProduct = () => {


        // refetch()
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        console.log(`delete${product.id}`);
        deleteFunc({ id: product.id });
        console.log(`delete${product.id}`);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        console.log(`delete${product.id}`);

        // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };
    const addNewProduct = () => {
        console.log(productCreate);
        console.log(cat);
        const category = cat
        console.log(selectedPicture);
        const formData = new FormData();
        formData.append("picture", selectedPicture);
        formData.append("name", productCreate.name);
        formData.append("category", cat);
        formData.append("country", productCreate.country);
        formData.append("chef", productCreate.chef);
        formData.append("price", productCreate.price);
        console.log(formData.picture);

        createNewProduct(formData);
        setAddProductDialog(false);
        // refetch()
    };
    const handlename = (e) => {
        setProductCreate(prevState => ({
            ...prevState,
            name: e.target.value
        }))
        // if(e.target.value!="" && e.target.value!=null)
        //     setAble(false)
        // else
        //     setAble(true) }
    }

    const handleCountry = (e) => {
        setProductCreate(prevState => ({
            ...prevState,
            country: e.target.value
        }))
    }
    const handlePrice = (e) => {
        setProductCreate(prevState => ({
            ...prevState,
            price: e.value
        }))
    }
    const handlePicture = (e) => {
        setProductCreate(prevState => ({
            ...prevState,
            country: e.target.value
        }))
    }
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" onClick={deleteProduct} />
        </React.Fragment>
    );
    const addProductDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideAddProductDialog} />
            {productCreate.name != null && productCreate.category != null &&
                productCreate.country != null && productCreate.price != null &&
                selectedPicture != null &&
                <Button label="Add" icon="pi pi-check" onClick={addNewProduct} />}
        </React.Fragment>
    );

    // onClick={deleteProduct} severity="danger"
    // const deleteProduct = () => {
    //     let _products = products.filter((val) => val.id !== product.id);

    //     setProducts(_products);
    //     setDeleteProductDialog(false);
    //     setProduct(emptyProduct);
    //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    // };
    const onUpload = (e) => {

        console.log("----------------------------------------------");
    }
    return (<>
        {/* <Avatar icon='pi pi-user'   size="large" shape="circle" /> */}
        {/* <Button onClick={addProduct}>add product</Button> */}
        <Button
            variant="contained"
            // startIcon={<PersonAddIcon />}
            onClick={addProduct}
            // startIcon="pi-lock-open"

            icon="pi pi-plus-circle" rounded
            style={{
                textAlign: "center",
                position: "fixed",
                bottom: "25px",
                left: "25px",
                zIndex: 1000,
                width: "300px",
                height: "50px"
            }}
        >
            Add Product
        </Button>

        <div className="card p-fluid">
            {/* <Button
                    variant="contained"
                    // startIcon={<PersonAddIcon />}
                    onClick={addProduct}
                    style={{
                        position: "fixed",
                        bottom: "10px",
                        left: "10px",
                        zIndex: 1000
                    }}
                >
                    Add Member
                </Button> */}

            <DataTable value={products} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="code" header="Code" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="name" header="Name" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column body={categoriesArr} header="Category" editor={(options) => categoryEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="picture" header="Picture" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column>
                <Column header="Update" rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column header="Delete" body={actionBodyTemplate} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column  exportable={false}  style={{ minWidth: '12rem' }}  bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} footer={deleteProductDialogFooter} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteProductDialog}>
                {/*  */}
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?<br></br>
                            {/* <img src={`http://localhost:7788/${product.picture}`}  style={{width:'100px'}}   /> */}

                        </span>

                    )}
                </div>
            </Dialog >
            <Dialog visible={addProductDialog} footer={addProductDialogFooter} onHide={hideAddProductDialog} >
                <div>
                    <InputText placeholder='name' onChange={handlename}></InputText><br></br><br></br>
                    <CategoriesList setCat={setCat} /><br></br>
                    {/* <MultiSelect value={selectedCategories} onChange={(e) =>setSelectedCategories(e.value)} options={categories} optionLabel="name" display="chip" 
                     filter placeholder="Select Categories"  className="w-full md:w-20rem" /><br></br> */}
                    <CountryList setProduct={setProductCreate} /><br></br>
                    {/* <Dropdown value={selectedCountries} onChange={(e) => setSelectedCountries(e.value)} options={countries} optionLabel="name" 
                        placeholder="Select a Country" className="w-full md:w-14rem" /><br></br> */}
                    <InputNumber placeholder='price' onChange={handlePrice}></InputNumber><br></br><br></br>
                    {/* <InputText placeholder='picture'onChange={handlePicture}></InputText><br></br><br></br> */}
                    <div className="card flex justify-content-center">
                        <FileUpload name="demo[]" auto accept="image/*" maxFileSize={1000000000000000} emptyTemplate={<p className="m-0">upload picture</p>}
                            uploadLabel='&nbsp;העלאה' cancelLabel='&nbsp;ביטול' chooseLabel='choose &nbsp;'
                                   /**/ customUpload uploadHandler={(e) => setSelectedPicture(e.files[0])} />

                    </div>
                </div>
            </Dialog>
        </div>
    </>);
}


