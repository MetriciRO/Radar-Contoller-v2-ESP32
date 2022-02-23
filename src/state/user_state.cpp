#include <state/user_state.h>

// User state
User::User() : username(""), password(""){};

void User::setUsername(String x)
{
    x.trim();
    if (x.length() <= 0)
        username = "";
    else
        username = x;
}
String User::getUsername()
{
    return username;
}

void User::setUserPassword(String x)
{
    x.trim();
    if (x.length() <= 0)
        password = "";
    else
        password = x;
}
String User::getUserPassword()
{
    return password;
}

bool User::user_flag()
{
    if (getUsername().length() > 0 && getUserPassword().length() > 0)
        return true;
    else
        return false;
}

User user;