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
            cout << code << endl;
            m.close();
            str = str.replace(pos, str.find("pt>") + 3 - pos, code);
        }
    } 
    str.replace(str.find("<!-- scripts -->"), 16, "<script>");
    str.replace(str.find("<!--   end   -->"), 16, "</script>");
    f.close();

    ofstream output;

    output.open("packed.html");
    output << str;

    cout<<str;

    return 0;
}
