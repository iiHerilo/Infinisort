#include <iostream>
#include <deque>
#include <fstream>
#include <sstream>
#include <string>
using namespace std;
/* THIS PACKS ALL SCRIPTS INTO ONE HTML FILE */
int main() {
    ifstream f("index.html");
    string str;
    if(f) {
        ostringstream ss;
        ss << f.rdbuf();
        str = ss.str();
    }
    int pos = 0;
    deque<string> modules;
    while(pos != -1) {
        pos = str.find("<script", pos);
        if(pos != -1) {
            int nd = str.find("</script>", pos);
            string path = "";
            string node = str.substr(pos, nd + 9 - pos);
            path = node.substr(13, node.find(".js") + 3 - 13);
            ifstream m(path);
            string code;
            if(m) {
                ostringstream ss;
                ss << m.rdbuf();
                code = ss.str();
            }
            cout << "<script>\n" + code + "\n</script>\n" << endl;
            m.close();
            str = str.replace(pos, str.find("pt>") + 3 - pos, "&lt;script id=\"" + path + "\"&gt;\n" + code + "\n&lt;/script&gt;\n");
        }
    } 
    for(int i = 0; i < str.length()-4; i++) {
        if(str.substr(i, 4) == "&lt;") {
            str = str.replace(i, 4, "<");
        }
        if(str.substr(i, 4) == "&gt;") {
            str = str.replace(i, 4, ">");
        }
    }
    //str.replace(str.find("<!-- scripts -->"), 16, "<script>");
    //str.replace(str.find("<!--   end   -->"), 16, "</script>");
    f.close();

    ofstream output;

    output.open("packed.html");
    output << str;

    cout<<str;

    return 0;
}
