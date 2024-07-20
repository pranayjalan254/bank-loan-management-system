#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>

using namespace std;

string func(float num)
{
  stringstream ss;
  ss << fixed << setprecision(5) << num;
  string numStr = ss.str();

  int pos = numStr.find('.');
  string intPart = numStr.substr(0, pos);
  string fracPart = numStr.substr(pos);
  int n = intPart.size();
  if (n > 3)
  {
    for (int i = n - 3; i > 0; i -= 2)
    {
      intPart.insert(i, ",");
    }
  }
  if (fracPart.size() < 5)
  {
    fracPart.append(5 - fracPart.size(), '0');
  }
  return intPart + fracPart;
}

int main()
{
  float num;
  cin >> num;
  cout << func(num) << endl;
  return 0;
}