#pragma once

#include <common.h>

class User
{
private:
    String username;
    String password;

public:
    void setUsername(String x);
    String getUsername();

    void setUserPassword(String x);
    String getUserPassword();

    bool user_flag();

    User();
};
extern User user;