<h1 align="center">
Front-end Roadmap | <a href="https://tomhsiao1260.github.io/roadmap/" target="_blank">View It<a/>
</h1>

<p align="center">
    <img src="./src/assets/roadmap.gif" width="600px"/>
</p>

<h3 align="center">
嘗試使用 D3.js 讓靜態的 <a href="https://roadmap.sh/frontend" target="_blank">Front-end Roadmap<a/> 變成可以透過點擊來展開、互動
<h3/>
<h4 align="center">
( Desktop with full-screen is recommended for a better experience )
<h4/>

## JSON File

### ./scr/data.json 

儲存了所有的節點資訊，結構如下：

```
{
    "name": "Root",
    "children": [
        { 
        "name": "Internet",
        "mode": 1,
            "children": [
                { "name": "How does internet work?", "mode": 1},
                { "name": "What is HTTP?", "mode": 1 },
                { "name": "Browsers and how they work?", "mode": 1 },
                { "name": "DNS and how it works?", "mode": 1 },
                { "name": "What is Domain Name?", "mode": 1 },
                { "name": "What is hoting?", "mode": 1 }
            ] 
        }
    ]
}
```

上方 name 為節點名稱，除根節點 Root 以外的節點都會顯示，children 下為子節點，mode 表示該節點的狀態（搭配 description.json 使用）


### ./scr/description.json 

儲存了左側的浮動說明欄位資訊，結構如下：

```
[
    {
        "mode": 1, 
        "color": "#000066", 
        "value": "Personal Recommendation / Opinion"
    }
]
```

若上方 mode 的值若與 data.json 中的任一節點的 mode 相同，便會在該節點的左上方加上指定的顏色圈圈，作為該節點的顏色標記。例如："name":  "Internet" 的節點具有 "mode":  1，便會在該節點的左上方加上色碼為 #000066 的顏色圈圈作為標記

## Installation

```
npm install
```

## Start Dev Server

```
npm start
```

## Build Prod Version

```
npm run build
```


