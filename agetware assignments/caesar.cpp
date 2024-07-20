#include <iostream>
#include <string>

using namespace std;
string encrypt(string message, int shift)
{
  string encrypted_message = "";

  for (char &ch : message)
  {
    if (isupper(ch))
    {
      ch = 'A' + (ch - 'A' + shift) % 26;
    }
    else if (islower(ch))
    {
      ch = 'a' + (ch - 'a' + shift) % 26;
    }
    encrypted_message += ch;
  }
  return encrypted_message;
}

string decrypt(string message, int shift)
{
  return encrypt(message, 26 - shift);
}