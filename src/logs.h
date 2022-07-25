#pragma once
#include <Arduino.h>
#include <vector>

struct RingBuffer
{
private:
    std::vector<String> buffer;
    size_t first;
    size_t last;
    size_t sz;

public:
    RingBuffer(int);

    bool empty() const;
    bool full() const;

    void push(String);
    String print() const;
};

extern RingBuffer circle;
extern RingBuffer debugBuffer;

void logOutput(String);
void debugOutput(String);