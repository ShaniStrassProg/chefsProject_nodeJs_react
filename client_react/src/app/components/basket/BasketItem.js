import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputNumber } from 'primereact/inputnumber';

export default function BasketItem(prop) {

    const changeCount= (productId, num)=>{
        const myBasket = JSON.parse(localStorage.getItem("basket"))
        const updateBasket = myBasket.map(prod=> prod.id== productId?{...prod,count:num}:prod)
        localStorage.setItem("basket",JSON.stringify(updateBasket))
    }

    const deleteItem = () => {
        const myBasket = JSON.parse(localStorage.getItem("basket"))
        const updateBasket = myBasket.filter(prod=> prod.id != prop.product.id)
        localStorage.setItem("basket",JSON.stringify(updateBasket))
        prop.refetch()
    }

    return (
        <div className="col-12" key={prop.product._id}>
                <div className="flex sm:flex-column align-items-center sm:align-items-start gap-3 sm:gap-2">
                    {prop.product.details.name}
                </div>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': prop.index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round picturesize" src={`http://localhost:7788/${prop.product.details.picture}`} alt={prop.product.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{prop.product.name}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    {/* <span className="font-semibold">{product.category[0].name}</span> */}
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <InputNumber value={prop.product.count} onValueChange={(e) => changeCount(prop.product.id,e.value)} showButtons buttonLayout="horizontal" incrementButtonClassName="p-button-text p-button-raised" decrementButtonClassName="p-button-text p-button-raised" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" min={1}/>
                        </div>
                        <div>
                            <span className="text-2xl font-semibold">${prop.product.details.price*prop.product.count}</span>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Button icon="pi pi-delete" onClick={deleteItem}></Button>
                        </div>
                    </div>
                </div>
            </div>
    )
}
        