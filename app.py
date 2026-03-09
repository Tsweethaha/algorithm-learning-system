# app.py
import os
from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__, static_folder="static", template_folder="templates")

# 单一数据源：算法列表（导航、进度、页面高亮共用）
ALGO_LIST = [
    {"id": "array", "name": "数组", "path": "/array"},
    {"id": "linkedlist", "name": "单链表", "path": "/linkedlist"},
    {"id": "stack", "name": "栈", "path": "/stack"},
    {"id": "queue", "name": "队列", "path": "/queue"},
    {"id": "tree_traversal", "name": "二叉树遍历", "path": "/tree_traversal"},
    {"id": "bst_insert", "name": "BST 插入", "path": "/bst_insert"},
    {"id": "heap", "name": "堆", "path": "/heap"},
    {"id": "graph_bfs", "name": "图 BFS", "path": "/graph_bfs"},
    {"id": "binary_search", "name": "二分查找", "path": "/binary_search"},
    {"id": "bubble", "name": "冒泡排序", "path": "/bubble"},
    {"id": "selection", "name": "选择排序", "path": "/selection"},
    {"id": "insertion", "name": "插入排序", "path": "/insertion"},
    {"id": "quick", "name": "快速排序", "path": "/quick"},
]

# 方便复用的渲染助手，统一注入导航 / 高亮
def render_algo_page(template_name: str, active_algo: str | None = None):
    return render_template(template_name, algos=ALGO_LIST, active_algo=active_algo)

# 从环境变量读取 API key，部署时在 Render 上配置环境变量名 DEEPSEEK_API_KEY
API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")  # 本地调试可以在环境变量中设置，或临时设为字符串
API_URL = "https://api.deepseek.com/chat/completions"

def call_deepseek(prompt, role_system):
    if not API_KEY:
        return "（未配置 API_KEY，本地模拟答案）请在系统中配置 DEEPSEEK_API_KEY 环境变量以获得真实 AI 回答。"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": role_system},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        result = response.json()
        if "choices" in result and len(result["choices"])>0:
            return result["choices"][0]["message"]["content"]
        else:
            return f"DeepSeek 返回结构异常：{result}"
    except Exception as e:
        return f"调用 DeepSeek 发生异常：{str(e)}"

# ---------- 页面路由 ----------
@app.route("/")
def index():
    return render_algo_page("index.html", active_algo=None)

@app.route("/bubble")
def bubble():
    return render_algo_page("bubble.html", active_algo="bubble")

@app.route("/array")
def array(): return render_algo_page("array.html", active_algo="array")

@app.route("/linkedlist")
def linkedlist(): return render_algo_page("linkedlist.html", active_algo="linkedlist")

@app.route("/stack")
def stack(): return render_algo_page("stack.html", active_algo="stack")

@app.route("/queue")
def queue(): return render_algo_page("queue.html", active_algo="queue")

@app.route("/tree_traversal")
def tree_traversal(): return render_algo_page("tree_traversal.html", active_algo="tree_traversal")

@app.route("/bst_insert")
def bst_insert(): return render_algo_page("bst_insert.html", active_algo="bst_insert")

@app.route("/heap")
def heap(): return render_algo_page("heap.html", active_algo="heap")

@app.route("/graph_bfs")
def graph_bfs(): return render_algo_page("graph_bfs.html", active_algo="graph_bfs")

@app.route("/binary_search")
def binary_search(): return render_algo_page("binary_search.html", active_algo="binary_search")

@app.route("/selection")
def selection(): return render_algo_page("selection.html", active_algo="selection")

@app.route("/insertion")
def insertion(): return render_algo_page("insertion.html", active_algo="insertion")

@app.route("/quick")
def quick(): return render_algo_page("quick.html", active_algo="quick")


# ---------- AI 接口 ----------
@app.route("/hint", methods=["POST"])
def get_hint():
    question = request.json.get("question", "")
    hint = call_deepseek(
        prompt=f"请给这个算法问题一个提示，但不要直接给出最终答案：{question}",
        role_system="你是算法导师，只提供提示，不给出最终答案。"
    )
    return jsonify({"answer": hint})

@app.route("/explain", methods=["POST"])
def get_explain():
    question = request.json.get("question", "")
    explain = call_deepseek(
        prompt=f"请以清晰、简短的方式解释：{question}",
        role_system="你是算法导师，提供易懂的解释。"
    )
    return jsonify({"answer": explain})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)
