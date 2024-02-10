import Banner2 from "../assets/img.jpg";
import Banner from "../assets/Banner.jpg";

const homeCrousal = [
  {
    id: 1,
    name: "Banner1",
    img: Banner,
  },
  {
    id: 2,
    name: "Banner1",
    img: Banner,
  },
  {
    id: 3,
    name: "Banner1",
    img: Banner,
  },
  {
    id: 4,
    name: "Banner1",
    img: Banner,
  },
  {
    id: 5,
    name: "Banner1",
    img: Banner,
  },
];

const apiProduct = [
  {
    id: 1,
    catalogue: "Pizza",
    img: Banner2,
    options: [
      {
        id: 1,
        name: "farmhouse",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["farmhouse", "pizza"],
        size: "8 inch",
        originalPrice: " ",
        discountedPrice: "84",
      },
      {
        id: 2,
        name: "mashroom",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["mashroom", "pizza"],
        size: "8 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 3,
        name: "peri peri paneer",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["peri peri", "paneer", "pizza"],
        size: "8 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 4,
        name: "paneer tikka",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["paneer tikka", "pizza"],
        size: "8 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 5,
        name: "paneer makhni",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["paneer makhni", "pizza"],
        size: "8 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 6,
        name: "schezwan paneer",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["schezwan", "paneer", "pizza"],
        size: "8 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
    ],
  },
  {
    id: 2,
    catalogue: "Burger",
    img: Banner2,
    options: [
      {
        id: 7,
        name: "crispy veggie burger",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["crispy", "burger"],
        size: "4 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 8,
        name: "crispy veggie cheese burger",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["crispy", "cheese", "burger"],
        size: "4 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 9,
        name: "paneer makhni burger",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["paneer", "makhni", "burger"],
        size: "4 inch",
        originalPrice: "90",
        discountedPrice: "84",
      },
    ],
  },
  {
    id: 3,
    catalogue: "Combo",
    img: Banner2,
    options: [
      {
        id: 10,
        name: "party special",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["special", "party", "combo"],
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 11,
        name: "spicy veg",
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["spicy veg", "combo"],
        originalPrice: "90",
        discountedPrice: "84",
      },
      {
        id: 12,
        productImg:
          "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHwxMTM4MTU1NXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
        name: "makhni",
        discription:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, debitis?",
        tag: ["makhni", "combo"],
        originalPrice: "90",
        discountedPrice: "84",
      },
    ],
  },
];

const LocationItems = [
  {
    name: "Pick Location",
    href: "#",
    subName: [
      {
        city: "Aurangabad",
        state: "Bihar",
      },
      {
        city: "Madanpur",
        state: "Bihar",
      },
    ],
  },
];

export { apiProduct, homeCrousal, LocationItems };
