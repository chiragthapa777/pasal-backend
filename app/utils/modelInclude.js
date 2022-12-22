const userSelectObject={
    id:true,
    name:true,
    email:true,
}

const reviewIncludeObject={
    include:{
        user:{
            select:userSelectObject
        }
    }
}

const questionReviewObject={
        answers:{
            include:{
                user:{
                    select:userSelectObject
                }
            }
        },
        user:{
            select:userSelectObject
        },
        product:true
    }



const productIncludeObject={
    productTags:{
        include:{
            tag:true
        }
    },
    vendor:true,
    questions:{
        include:questionReviewObject
    },
    images:true,
    discounts:{
        where:{
            isValid:true
        }
    },
    reviews:reviewIncludeObject,
    _count:{
        select:{
            reviews:true,
            questions:true
        }
    }
   
}



module.exports={
    productIncludeObject,
    userSelectObject,
    questionReviewObject
}