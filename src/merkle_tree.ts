const hash = (str: string, seed: number = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

class Node {
    data: number
    left: Node | null
    right: Node | null
    parent: Node | null
    constructor(data: number, 
        parent: Node | null = null) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.parent = parent;
    }
}

class DynamicMerkleTree {
    head: Node;
    depth: number;

    constructor(initialData: string) {
        this.head = new Node(hash(initialData));
        this.depth = 0;
    }

    private hashSum(startingNode: Node) {
        let m = '';
        if (startingNode.left !== null) {
            m += startingNode.left.data.toString();
        }
        if (startingNode.right !== null) {
            m += startingNode.right.data.toString();
        }
        startingNode.data = hash(m);
        if (startingNode.parent !== null) {
            this.hashSum(startingNode.parent);
        }
    }

    addNode(data: string) {
        // push, pop only
        let q: Array<[Node, number]> = [];
        q.push([this.head, 0]);
        while (q.length != 0) {
            // Not sure if the base case works
            let a, c;
            [a, c]  = q.pop()!;
            if (c === this.depth - 1) {
                if (a.left === null) {
                    a.left = new Node(hash(data), a);
                }
                else if (a.right === null) {
                    a.right = new Node(hash(data), a);
                }
                this.hashSum(a);
                break;
            }
            else if (a.left === null) {
                a.left = new Node(-1, a);
                q.push([a.left, c++]);
            }
            else if (a.right === null) {
                a.right = new Node(-1, a);
                q.push([a.right, c++]);
            }
            else {
                q.push([a.right, c++]);
                q.push([a.left, c++]);
            }
        }
        // Pass: finish later lmao
    }

}